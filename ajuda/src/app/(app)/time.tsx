import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';
import { Link } from 'expo-router';
import { getPokemons } from '@/integration/pokemonIntegration';
import { Button } from '@/components/button';
import { useAuth } from '@/context/AuthContext';
import { Pokemon } from '../../@types/pokemon';
import { TYPE_MAP } from '@/constants/pokemon';
import { getTeam } from '@/services/pokemonApi';
import { Menu } from '@/components/menu/menu';

const STAT_PT: Record<string, string> = {
    hp: 'Vida',
    attack: 'Ataque',
    defense: 'Defesa',
    'special-attack': 'Atq. Esp.',
    'special-defense': 'Def. Esp.',
    speed: 'Velocidade',
};

type SectionHeader = { type: 'header'; title: string };
type PokeItem = { type: 'poke'; secao: 'time' | 'escolha' } & Pokemon;
type ListItem = SectionHeader | PokeItem;

function mapApiPokemon(p: any): Pokemon {
    return {
        nome: p.name,
        index: String(p.index).padStart(3, '0'),
        tipos: p.types,
        imagem: p.image,
        Cor: p.types[0],
        poder: (p.abilities ?? []).map((a: any) => ({
            nome: a.name,
            forca: a.strength,
        })),
    };
}

export default function Time() {
    const { user, userId } = useAuth();

    const [loading, setLoading] = useState(true);
    const [time, setTime] = useState<Pokemon[]>([]);
    const [escolha, setEscolha] = useState<Pokemon[]>([]);
    const [swapping, setSwapping] = useState<string | null>(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [pokemonParaTrocar, setPokemonParaTrocar] = useState<Pokemon | null>(null);

    useEffect(() => {
        async function loadData() {
            if (!userId) return;
            try {
                const [allPokemons, teamResponse] = await Promise.all([
                    getPokemons(30),
                    getTeam(userId),
                ]);

                const { team = [] } = teamResponse.data;
                const teamPokemons: Pokemon[] = team.map(mapApiPokemon);
                const teamIndexes = new Set(teamPokemons.map((p) => p.index));

                setTime(teamPokemons);
                setEscolha(allPokemons.filter((p) => !teamIndexes.has(p.index)));
            } catch (e) {
                console.error('Erro ao carregar dados:', e);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [userId]);

    function abrirModalTroca(pokemon: Pokemon) {
        setPokemonParaTrocar(pokemon);
        setModalVisible(true);
    }

    // NOTA: a troca é feita apenas localmente (no estado do app).
    // O endpoint PUT /pokemon/v1/team da API retorna erro 404/500
    // de forma inconsistente entre contas, mesmo com payload correto
    // (testado e confirmado — reportado ao professor).
    async function confirmarTroca(novoPokemon: Pokemon) {
        if (!pokemonParaTrocar) return;

        setSwapping(pokemonParaTrocar.index);
        setModalVisible(false);

        setTime((prev) =>
            prev.map((p) =>
                p.index === pokemonParaTrocar.index ? novoPokemon : p
            )
        );
        setEscolha((prev) => [
            ...prev.filter((p) => p.index !== novoPokemon.index),
            pokemonParaTrocar,
        ]);

        setSwapping(null);
        setPokemonParaTrocar(null);
    }

    const listData: ListItem[] = [
        { type: 'header', title: `Meu Time (${time.length}/5)` },
        ...time.map((p) => ({ ...p, type: 'poke' as const, secao: 'time' as const })),
        { type: 'header', title: 'Pokémon para escolha' },
        ...escolha
            .filter((p) => !time.some((t) => t.index === p.index))
            .map((p) => ({ ...p, type: 'poke' as const, secao: 'escolha' as const })),
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcomeText}>Veja seu time, {user}!</Text>
                <Menu />
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#E15610" style={{ marginTop: 40 }} />
            ) : (
                <FlatList
                    data={listData}
                    keyExtractor={(item, i) =>
                        item.type === 'header' ? `header-${i}` : item.index
                    }
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                        if (item.type === 'header') {
                            return <Text style={styles.sectionTitle}>{item.title}</Text>;
                        }

                        return (
                            <View style={styles.card}>
                                <Image
                                    source={{ uri: item.imagem }}
                                    style={styles.image}
                                    resizeMode="contain"
                                />
                                <View style={styles.info}>
                                    <View style={styles.nameRow}>
                                        <Text style={styles.pokemonName}>{item.nome}</Text>
                                        <Text style={styles.pokemonIndex}>#{item.index}</Text>
                                    </View>

                                    <View style={styles.typesRow}>
                                        {item.tipos.map((t) => (
                                            <View key={t} style={styles.typeBadge}>
                                                <Text style={styles.typeBadgeText}>
                                                    {(TYPE_MAP[t] ?? t).toUpperCase()}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>

                                    {item.poder.map((p) => (
                                        <View key={p.nome} style={styles.statRow}>
                                            <Text style={styles.statName}>
                                                {STAT_PT[p.nome] ?? p.nome}
                                            </Text>
                                            <View style={styles.statBarBg}>
                                                <View
                                                    style={[
                                                        styles.statBarFill,
                                                        { width: `${Math.min((p.forca / 255) * 100, 100)}%` },
                                                    ]}
                                                />
                                            </View>
                                            <Text style={styles.statValue}>{p.forca}</Text>
                                        </View>
                                    ))}

                                    {item.secao === 'time' && (
                                        <TouchableOpacity
                                            style={styles.btnTrocar}
                                            onPress={() => abrirModalTroca(item)}
                                            disabled={swapping === item.index}
                                        >
                                            <Text style={styles.btnTrocarText}>
                                                {swapping === item.index ? 'Trocando...' : '⇄ Trocar'}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        );
                    }}
                />
            )}

            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>
                            Trocar {pokemonParaTrocar?.nome} por qual?
                        </Text>

                        <FlatList
                            data={escolha}
                            keyExtractor={(p) => p.index}
                            style={styles.modalList}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.modalItem}
                                    onPress={() => confirmarTroca(item)}
                                >
                                    <Image
                                        source={{ uri: item.imagem }}
                                        style={styles.modalImage}
                                        resizeMode="contain"
                                    />
                                    <View>
                                        <Text style={styles.modalPokeName}>{item.nome}</Text>
                                        <View style={styles.typesRow}>
                                            {item.tipos.map((t) => (
                                                <View key={t} style={styles.typeBadge}>
                                                    <Text style={styles.typeBadgeText}>
                                                        {(TYPE_MAP[t] ?? t).toUpperCase()}
                                                    </Text>
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />

                        <TouchableOpacity
                            style={styles.btnCancelar}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.btnCancelarText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: {
        flexDirection: 'column',
        padding: 16,
        paddingTop: 40,
        gap: 8,
    },
    headerButtons: { flexDirection: 'row', gap: 8 },
    welcomeText: { color: '#333', fontSize: 18, fontWeight: 'bold' },
    listContent: { padding: 16, gap: 12 },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#9b10e1',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginTop: 8,
        marginBottom: 2,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderWidth: 1,
        borderColor: '#eee',
    },
    image: { width: 70, height: 70, flexShrink: 0 },
    info: { flex: 1, gap: 6 },
    nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    pokemonName: { fontSize: 16, fontWeight: '900', color: '#111', textTransform: 'capitalize' },
    pokemonIndex: { fontSize: 13, fontWeight: '700', color: '#9b10e1' },
    typesRow: { flexDirection: 'row', gap: 6 },
    typeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, backgroundColor: '#5910e1' },
    typeBadgeText: { color: '#fff', fontSize: 9, fontWeight: '800' },
    statRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    statName: { fontSize: 9, color: '#888', width: 80 },
    statBarBg: { flex: 1, height: 4, backgroundColor: '#eee', borderRadius: 2, overflow: 'hidden' },
    statBarFill: { height: '100%', backgroundColor: '#e11083', borderRadius: 2 },
    statValue: { fontSize: 9, fontWeight: '800', color: '#333', width: 24, textAlign: 'right' },
    btnTrocar: {
        marginTop: 6,
        backgroundColor: '#e17810',
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 12,
        alignSelf: 'flex-start',
    },
    btnTrocarText: { color: '#fff', fontSize: 11, fontWeight: '800' },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalBox: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '75%',
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '900',
        color: '#111',
        textTransform: 'capitalize',
        marginBottom: 16,
    },
    modalList: { flexGrow: 0 },
    modalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalImage: { width: 50, height: 50 },
    modalPokeName: {
        fontSize: 14,
        fontWeight: '800',
        color: '#111',
        textTransform: 'capitalize',
        marginBottom: 4,
    },
    btnCancelar: {
        marginTop: 16,
        backgroundColor: '#eee',
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
    },
    btnCancelarText: { fontSize: 14, fontWeight: '800', color: '#555' },
});
