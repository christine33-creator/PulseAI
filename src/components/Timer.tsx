import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useTheme } from '../contexts/ThemeContext';

type Props = {
  seconds: number;
  isActive: boolean;
  isBreak: boolean;
};

export function Timer({ seconds, isActive, isBreak }: Props) {
  const { theme } = useTheme();
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text
        variant="displayLarge"
        style={[
          styles.time,
          {
            color: isBreak ? theme.colors.success : theme.colors.primary,
            opacity: isActive ? 1 : 0.7,
          },
        ]}
      >
        {formatTime(seconds)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 32,
  },
  time: {
    fontVariant: ['tabular-nums'],
  },
}); 