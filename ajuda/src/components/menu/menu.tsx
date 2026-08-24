import { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    StyleSheet,
    Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export function Menu() {
    const [open, setOpen] = useState(false);
    const { signOut, user } = useAuth();
    const router = useRouter();

    function navigate(href: '/dashboard' | '/time' | '/profile') {
        setOpen(false);
        setTimeout(() => router.push(href), 150);
    }

    function handleSignOut() {
        setOpen(false);
        setTimeout(() => signOut(), 150);
    }

    return (
        <>
            <TouchableOpacity
                style={styles.hamburger}
                onPress={() => setOpen(true)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityLabel="Abrir menu"
            >
                <View style={styles.bar} />
                <View style={styles.bar} />
                <View style={styles.bar} />
            </TouchableOpacity>

            <Modal
                visible={open}
                transparent
                animationType="fade"
                onRequestClose={() => setOpen(false)}
            >
                <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
                    <Pressable style={styles.drawer} onPress={() => {}}>
                        <View style={styles.drawerInner}>

                            <View style={styles.drawerHeader}>
                              

                                <Text style={styles.drawerUser} numberOfLines={1}>
                                    {user}
                                </Text>

                                <TouchableOpacity
                                    style={styles.closeBtn}
                                    onPress={() => setOpen(false)}
                                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                >
                                    <Text style={styles.closeBtnText}>✕</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.divider} />

                            <MenuItem
                                icon="home-outline"
                                label="Dashboard"
                                onPress={() => navigate('/dashboard')}
                            />

                            <MenuItem
                                icon="people-outline"
                                label="Meu Time"
                                onPress={() => navigate('/time')}
                            />

                            <MenuItem
                                icon="person-outline"
                                label="Perfil"
                                onPress={() => navigate('/profile')}
                            />

                            <View style={styles.spacer} />
                            <View style={styles.divider} />

                            <MenuItem
                                icon="log-out-outline"
                                label="Sair"
                                onPress={handleSignOut}
                                danger
                            />
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </>
    );
}

type MenuItemProps = {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    onPress: () => void;
    danger?: boolean;
};

function MenuItem({ icon, label, onPress, danger }: MenuItemProps) {
    return (
        <TouchableOpacity
            style={styles.menuItem}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Ionicons
                name={icon}
                size={20}
                color={danger ? '#e11010' : '#222'}
            />

            <Text style={[styles.menuLabel, danger && styles.menuLabelDanger]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    /* botão hamburguer */
    hamburger: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 999,
    padding: 4,
    gap: 5,
    justifyContent: 'center',
    },
    bar: {
        width: 24,
        height: 3,
        backgroundColor: '#a32bd3',
        borderRadius: 2,
    },

    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },

    /* painel lateral */
    drawer: {
        width: 260,
        backgroundColor: '#fff',
        height: '100%',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 12,
    },
    drawerInner: {
        flex: 1,
        paddingVertical: 12,
    },

    /* cabeçalho do drawer */
    drawerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 10,
    },
    avatarCircle: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#9b10e1',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: '#fff',
        fontWeight: '900',
        fontSize: 18,
    },
    drawerUser: {
        flex: 1,
        fontSize: 15,
        fontWeight: '700',
        color: '#111',
    },
    closeBtn: {
        padding: 4,
    },
    closeBtnText: {
        fontSize: 16,
        color: '#888',
    },

    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 8,
        marginHorizontal: 16,
    },

    /* itens */
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 14,
        paddingHorizontal: 20,
    },
    menuEmoji: {
        fontSize: 20,
    },
    menuLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#222',
    },
    menuLabelDanger: {
        color: '#e11010',
    },

    spacer: {
        flex: 1,
    },
});
