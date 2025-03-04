import { StyleSheet, View, ViewProps } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

type Props = ViewProps & {
  variant?: 'default' | 'elevated';
};

export function ThemedSurface({ style, variant = 'default', ...props }: Props) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.surface,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.roundness,
          ...(variant === 'elevated' && {
            elevation: 2,
            shadowColor: theme.colors.backdrop,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          }),
        },
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  surface: {
    borderRadius: 8,
  },
}); 