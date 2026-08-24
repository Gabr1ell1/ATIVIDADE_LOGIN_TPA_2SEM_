import { useAuth } from '@/context/AuthContext';
import { Link } from 'expo-router';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Button } from '@/components/button';
import { useEffect, useState } from 'react';
import { getProfile } from '@/services/pokemonApi';
import { Menu } from '@/components/menu/menu';

export default function Profile() {
    const { user, userId } = useAuth();

    const [partidas, setPartidas] = useState(0);
    const [vitorias, setVitorias] = useState(0);
    const [derrotas, setDerrotas] = useState(0);

   useEffect(() => {
    console.log('userId:', userId);
    if (!userId) return;

    getProfile(userId)
        .then(res => {
            console.log('resposta da API:', JSON.stringify(res.data));
            const data = res.data;
            const v = parseInt(data.vitorias ?? '0');
            const d = parseInt(data.derrotas ?? '0');
            setVitorias(v);
            setDerrotas(d);
            setPartidas(v + d);
        })
        .catch(err => console.error('Erro ao buscar perfil:', err));
}, [userId]);


    return (
        <View style={styles.wrapper}>    
                {/* cabeçalho */}
               <View style={styles.header}>
                <Menu />
            </View>
   

    <View style={styles.container}>

            {/* CARD PERFIL */}
            <View style={styles.profileCard}>

           <Image
    source={require('../../../assets/images/avatar.png')}
    style={styles.avatar}
/>

                {/* nome */}
                <Text style={styles.username}>
                    {user}
                </Text>

                {/* subtítulo */}
                <Text style={styles.subtitle}>
                    Professor(a)
                </Text>

                {/* estatísticas */}
                <View style={styles.statsContainer}>

                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>
                            {partidas}
                        </Text>

                        <Text style={styles.statLabel}>
                            Partidas
                        </Text>
                    </View>

                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>
                            {vitorias}
                        </Text>

                        <Text style={styles.statLabel}>
                            Vitórias
                        </Text>
                    </View>

                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>
                            {derrotas}
                        </Text>

                        <Text style={styles.statLabel}>
                            Derrotas
                        </Text>
                    </View>

                </View>
            </View>
        </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        padding: 20,
    },

    profileCard: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 30,
        alignItems: 'center',
    justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },

    avatar: {
        width: 150,
        height: 150,
        borderRadius: 999,
        borderWidth: 4,
        borderColor: '#9b10e1',
    },

    wrapper: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 20,
        paddingTop: 40,
    },
    headerButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    username: {
        fontSize: 28,
        fontWeight: '900',
        color: '#111',
    },

    subtitle: {
        fontSize: 14,
        color: '#777',
        marginTop: 4,
        marginBottom: 10,
    },

    statsContainer: {
        flexDirection: 'row',
        gap: 14,
    },

    statBox: {
       backgroundColor: '#f3ebff',
    paddingVertical: 14,      // reduz um pouco
    paddingHorizontal: 12,    // reduz
    borderRadius: 18,
    alignItems: 'center',
    minWidth: 80,             // era 95
    flex: 1,  
    },

    statNumber: {
        fontSize: 28,
        fontWeight: '900',
        color: '#7b10e1',
    },

    statLabel: {
        fontSize: 13,
        color: '#555',
        marginTop: 4,
        fontWeight: '600',
    },
});
