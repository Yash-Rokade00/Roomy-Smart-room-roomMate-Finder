import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
  TextStyle,
  PressableProps,
} from 'react-native';
import { COLORS, RADIUS, TYPOGRAPHY } from '../../theme/theme';
import { moderateScale, shadows } from '../../utils/responsive';

interface ButtonProps extends PressableProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  loading = false,
  style,
  textStyle,
  icon,
  disabled,
  ...props
}) => {
  const getButtonStyles = (): ViewStyle => {
    switch (variant) {
      case 'secondary':
        return { backgroundColor: COLORS.secondary };
      case 'danger':
        return { backgroundColor: COLORS.danger };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: COLORS.primary,
        };
      case 'primary':
      default:
        return { backgroundColor: COLORS.primary };
    }
  };

  const getButtonTextStyles = (): TextStyle => {
    switch (variant) {
      case 'outline':
        return { color: COLORS.primary };
      default:
        return { color: COLORS.white };
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.baseButton,
        getButtonStyles(),
        shadows.md,
        style,
        (disabled || loading) && styles.disabledButton,
        pressed && styles.pressedButton,
      ]}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' ? COLORS.primary : COLORS.white}
        />
      ) : (
        <React.Fragment>
          {icon && <React.Fragment>{icon}</React.Fragment>}
          <Text style={[styles.baseText, getButtonTextStyles(), textStyle]}>
            {title}
          </Text>
        </React.Fragment>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    height: moderateScale(50),
    borderRadius: RADIUS.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: moderateScale(20),
    gap: moderateScale(10),
  },
  baseText: {
    ...TYPOGRAPHY.button,
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  pressedButton: {
    opacity: 0.85,
  },
});
