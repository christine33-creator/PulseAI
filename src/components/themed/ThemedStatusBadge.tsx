import { StyleSheet, View, ViewProps } from 'react-native';
import { Text } from 'react-native-paper';
import { useTheme } from '../../contexts/ThemeContext';
import { Task } from '../../types';

type Props = ViewProps & {
  status: Task['status'];
};

export function ThemedStatusBadge({ status, style, ...props }: Props) {
  const { theme } = useTheme();

  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return theme.colors.success;
      case 'in_progress':
        return theme.colors.primary;
      default:
        return theme.colors.secondary;
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      default:
        return 'Pending';
    }
  };

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: getStatusColor(),
          borderRadius: theme.roundness,
        },
        style,
      ]}
      {...props}
    >
      <Text
        variant="labelSmall"
        style={[
          styles.text,
          {
            color: theme.dark ? theme.colors.background : '#FFFFFF',
          },
        ]}
      >
        {getStatusLabel()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  text: {
    fontWeight: '500',
  },
}); 