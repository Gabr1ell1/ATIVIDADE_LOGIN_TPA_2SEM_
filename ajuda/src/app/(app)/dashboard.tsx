import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { getPokemons } from '@/integration/pokemonIntegration'; // função que busca os pokémons da API
import { Button } from '@/components/button'; // botão estilizado do projeto
import { useAuth } from '@/context/AuthContext'; // pega o usuário logado e função de sair
import { Pokemon } from '../../@types/pokemon'; // tipo que define como um pokémon é
import { TYPE_MAP } from '@/constants/pokemon'; // mapa de tradução dos tipos (fire → fogo)
import profile from '@/app/(app)/profile';
import { Menu } from '@/components/menu/menu';

const STAT_PT: Record<string, string> = {
    hp: 'Vida',
    attack: 'Ataque',
    defense: 'Defesa',
    'special-attack': 'Atq. Esp.',
    'special-defense': 'Def. Esp.',
    speed: 'Velocidade',
};

export default function Dashboard() {
    // pega o nome do usuário logado e a função de sair
    const { user, signOut } = useAuth();

    // guarda se tá carregando (começa true = tá carregando)
    const [loading, setLoading] = useState(true);
    // guarda a lista de pokémons (começa vazia)
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);

    // roda uma vez quando a tela abre
    useEffect(() => {
        async function loadData() {
            try {
                // busca os 20 primeiros pokémons da API
                const data = await getPokemons(151);
                // salva os pokémons no estado pra aparecer na tela
                setPokemons(data);
            } catch (e) {
                // se der erro, mostra no console
                console.error('Erro ao carregar pokémons:', e);
            } finally {
                // sempre no final, para o loading
                setLoading(false);
            }
        }
        loadData(); // chama a função
    }, []); // [] = roda só uma vez

    return (
        <View style={styles.container}>
        
         {/* cabeçalho */}
            <View style={styles.header}>
                <Text style={styles.welcomeText}>Bem-vindo, {user}!</Text>
                <Menu />
            </View>
            
            {/* se tiver carregando mostra um spinner, senão mostra a lista */}
            {loading ? (
                <ActivityIndicator size="large" color="#E15610" style={{ marginTop: 40 }} />
            ) : (
                // lista que rola com todos os pokémons
                <FlatList
                    data={pokemons}                          // dados da lista
                    keyExtractor={(item) => item.index}      // id único de cada item
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}     // esconde a barrinha de scroll
                    renderItem={({ item }) => (
                        // card de cada pokémon
                        <View style={styles.card}>

                            {/* imagem do pokémon */}
                            <Image
                                source={{ uri: item.imagem }}
                                style={styles.image}
                                resizeMode="contain" // não corta a imagem
                            />

                            {/* coluna com todas as infos */}
                            <View style={styles.info}>

                                {/* linha do nome + número */}
                                <View style={styles.nameRow}>
                                    <Text style={styles.pokemonName}>{item.nome}</Text>
                                    <Text style={styles.pokemonIndex}>#{item.index}</Text>
                                </View>

                                {/* badges dos tipos em português */}
                                <View style={styles.typesRow}>
                                    {item.tipos.map((t) => (
                                        <View key={t} style={styles.typeBadge}>
                                            <Text style={styles.typeBadgeText}>
                                                {/* TYPE_MAP[t] traduz o tipo, ex: fire → fogo */}
                                                {(TYPE_MAP[t] ?? t).toUpperCase()}
                                            </Text>
                                        </View>
                                    ))}
                                </View>

                                {/* barras de stats em português */}
                                {item.poder.map((p) => (
                                    <View key={p.nome} style={styles.statRow}>

                                        {/* nome do stat traduzido, ex: attack → Ataque */}
                                        <Text style={styles.statName}>
                                            {STAT_PT[p.nome] ?? p.nome}
                                        </Text>

                                        {/* fundo cinza da barra */}
                                        <View style={styles.statBarBg}>
                                            {/* parte laranja que cresce conforme o valor */}
                                            <View
                                                style={[
                                                    styles.statBarFill,
                                                    {
                                                        // 255 é o valor máximo de um stat
                                                        width: `${Math.min((p.forca / 255) * 100, 100)}%`
                                                    },
                                                ]}
                                            />
                                        </View>

                                        {/* número do stat */}
                                        <Text style={styles.statValue}>{p.forca}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    // tela toda
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    // cabeçalho
header: {
    flexDirection: 'column',  // empilha em vez de lado a lado
    padding: 16,
    paddingTop: 40,
    gap: 8,
},
headerButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',  // quebra linha se não couber
},
    // texto "Bem-vindo, kleber"
    welcomeText: {
        color: '#333',
        fontSize: 18,
        fontWeight: 'bold',
    },
    // botão sair
    logoutBtn: {
        
        width: 80,
        height: 36,
    },

    ProfileBtn: {
                marginLeft: '100%',
        width: 80,
        height: 36,
    },
    // espaçamento da lista
    listContent: {
        padding: 16,
        gap: 12,
    },
    // card branco de cada pokémon
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
    // imagem do pokémon
    image: {
        width: 70,
        height: 70,
        flexShrink: 0,
    },
    // coluna de info do pokémon
    info: {
        flex: 1,
        gap: 6,
    },
    // linha do nome + número
    nameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    // nome do pokémon
    pokemonName: {
        fontSize: 16,
        fontWeight: '900',
        color: '#111',
        textTransform: 'capitalize', // primeira letra maiúscula
    },
    // número do pokémon (#001)
    pokemonIndex: {
        fontSize: 13,
        fontWeight: '700',
        color: '#9b10e1',
    },
    // linha dos badges de tipo
    typesRow: {
        flexDirection: 'row',
        gap: 6,
    },
    // badge laranja do tipo
    typeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 999,
        backgroundColor: '#5910e1',
    },
    // texto dentro do badge
    typeBadgeText: {
        color: '#fff',
        fontSize: 9,
        fontWeight: '800',
    },
    // linha de um stat
    statRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    // nome do stat (Vida, Ataque...)
    statName: {
        fontSize: 9,
        color: '#888',
        width: 80,
    },
    // fundo cinza da barra
    statBarBg: {
        flex: 1,
        height: 4,
        backgroundColor: '#eee',
        borderRadius: 2,
        overflow: 'hidden',
    },
    // parte laranja da barra
    statBarFill: {
        height: '100%',
        backgroundColor: '#e11083',
        borderRadius: 2,
    },
    // número do stat
    statValue: {
        fontSize: 9,
        fontWeight: '800',
        color: '#333',
        width: 24,
        textAlign: 'right',
    },
});