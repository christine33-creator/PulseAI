import { StyleSheet, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { ThemedButton } from './themed/ThemedButton';
import { ThemedIcon } from './themed/ThemedIcon';

type Props = {
  isActive: boolean;
  onStart: () => void;
  onPause: () => void;
  onComplete: () => void;
};

export function FocusControls({ isActive, onStart, onPause, onComplete }: Props) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {isActive ? (
        <>
          <ThemedButton
            mode="contained"
            onPress={onPause}
            style={styles.button}
            icon={({ size, color }) => (
              <ThemedIcon name="pause" size={size} color={color} />
            )}
          >
            Pause
          </ThemedButton>

          <ThemedButton
            mode="outlined"
            onPress={onComplete}
            style={styles.button}
            variant="error"
            icon={({ size, color }) => (
              <ThemedIcon name="stop" size={size} color={color} />
            )}
          >
            End Session
          </ThemedButton>
        </>
      ) : (
        <ThemedButton
          mode="contained"
          onPress={onStart}
          style={styles.button}
          icon={({ size, color }) => (
            <ThemedIcon name="play" size={size} color={color} />
          )}
        >
          Start Session
        </ThemedButton>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 16,
  },
  button: {
    minWidth: 120,
  },
}); 