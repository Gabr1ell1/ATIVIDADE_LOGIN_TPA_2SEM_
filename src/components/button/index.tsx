import { TouchableOpacity, Text, TouchableOpacityProps, StyleProp, ViewStyle } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from "./styles";

type Props = TouchableOpacityProps & {
    title: string;
    style?: StyleProp<ViewStyle>;
}

export function Button({ title, style, ...rest }: Props) {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            {...rest}
        >
            <LinearGradient
                colors={['#5f00ba','#f46026']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.button, style]}
            >
                <Text style={styles.title}>{title}</Text>
            </LinearGradient>
        </TouchableOpacity>
    )
}