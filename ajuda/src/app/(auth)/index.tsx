import { useState } from 'react';
import { Link, router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

import { View, StyleSheet, Image, Text } from 'react-native';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import Card from '@/components/card';
import { Alert } from '@/components/alert';

export default function Index() {
    const [name, setName] = useState('');
    const [senha, setSenha] = useState('');

    const [isAlertVisible, setIsAlertVisible] = useState(false);

    const [alertData, setAlertData] = useState({
        title: '',
        message: '',
        type: 'success' as 'success' | 'error' | 'warning' | 'info',
    });

    const { signIn } = useAuth();

    async function validateCredentials() {
        // Verifica se os campos foram preenchidos
        if (!name.trim() || !senha.trim()) {
            setAlertData({
                title: 'Campos obrigatórios',
                message: 'Por favor, preencha o nome e a senha.',
                type: 'warning',
            });

            setIsAlertVisible(true);
            return;
        }

        try {
            // Tenta fazer o login
            const success = await signIn(name, senha);

            // O signIn retorna um objeto { ok: true/false }
            if (success.ok) {
                // Login realizado com sucesso
                router.replace('/dashboard');
            } else {
                // Login recusado
                setAlertData({
                    title: 'Acesso negado',
                    message: 'Nome ou senha incorretos. Tente novamente.',
                    type: 'error',
                });

                setIsAlertVisible(true);
            }
        } catch (error) {
            console.log('ERRO NO LOGIN:', error);

            setAlertData({
                title: 'Erro no login',
                message: 'Não foi possível realizar o login. Tente novamente.',
                type: 'error',
            });

            setIsAlertVisible(true);
        }
    }

    return (
        <View style={styles.container}>
            <Card>

                <Text style={styles.loginTitle}>
                    Login
                </Text>

                <Image
                    source={require('../../../assets/images/log-in.png')}
                    style={{
                        width: 120,
                        height: 120,
                        alignSelf: 'center',
                    }}
                />

                <Input
                    placeholder="Digite seu usuário"
                    onChangeText={setName}
                    value={name}
                />

                <Input
                    placeholder="Digite sua senha"
                    secureTextEntry
                    onChangeText={setSenha}
                    value={senha}
                />

                <Button
                    title="Enviar"
                    onPress={validateCredentials}
                    style={{ marginTop: 20 }}
                />

                <Link href="/register" asChild>
                    <Text style={styles.destaque}>
                        Cadastre-se aqui!
                    </Text>
                </Link>

            </Card>

            <Alert
                title={alertData.title}
                message={alertData.message}
                type={alertData.type}
                visible={isAlertVisible}
                onClose={() => setIsAlertVisible(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f5f7',
        justifyContent: 'center',
        padding: 32,
        gap: 16,
    },

    registerText: {
        textAlign: 'center',
        marginTop: 20,
    },

    destaque: {
        textAlign: 'center',
        color: '#5d0f72',
        fontWeight: 'bold',
    },

    loginTitle: {
        textAlign: 'center',
        fontSize: 28,
        fontWeight: '700',
        color: '#4b187a',
        letterSpacing: 6,
        textTransform: 'uppercase',
    },
});