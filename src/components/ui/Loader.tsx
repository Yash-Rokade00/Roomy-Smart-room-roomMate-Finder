import React from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../../theme/theme';
import { moderateScale } from '../../utils/responsive';

interface LoaderProps {
  fullscreen?: boolean;
  message?: string;
  size?: 'small' | 'large';
}

export const Loader: React.FC<LoaderProps> = ({
  fullscreen = false,
  message,
  size = 'large',
}) => {
  if (fullscreen) {
    return (
      <View style={styles.fullscreenContainer}>
        <View style={styles.modalBox}>
          <ActivityIndicator size={size} color={COLORS.primary} />
          {message && <Text style={styles.messageText}>{message}</Text>}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.inlineContainer}>
      <ActivityIndicator size={size} color={COLORS.primary} />
      {message && <Text style={[styles.messageText, { color: COLORS.textLight }]}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  fullscreenContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  modalBox: {
    backgroundColor: COLORS.white,
    padding: moderateScale(25),
    borderRadius: moderateScale(15),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    minWidth: moderateScale(120),
  },
  inlineContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: moderateScale(20),
  },
  messageText: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: moderateScale(12),
    textAlign: 'center',
  },
});
