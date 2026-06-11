import React, { useEffect, useState } from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
  Pressable,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import EmailIcon from 'react-native-vector-icons/Fontisto';
import LockIcon from 'react-native-vector-icons/Feather';
import ArrowRightIcon from 'react-native-vector-icons/Feather';

import AuthBackground from '../../../assets/Images/AuthBackground.jpg';
import { useAuthStore } from '../../../store/authStore';
import useNotification from '../../../hooks/useNotification';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { KeyboardShiftView } from '../../../components/layouts/KeyboardShiftView';
import { COLORS, TYPOGRAPHY, RADIUS } from '../../../theme/theme';
import { deviceHeight, deviceWidth, moderateScale, spacing, shadows } from '../../../utils/responsive';

// Zod Login Validation Schema
const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginSchemaType = z.infer<typeof loginSchema>;

interface LoginScreenProps {
  navigation: any;
  route: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation, route }) => {
  const { notificationHandler } = useNotification();
  const login = useAuthStore(state => state.login);
  const isLoading = useAuthStore(state => state.isLoading);
  const [error, setError] = useState<string>('');
  const [isRegistered, setIsRegistered] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (route?.params?.afterRegistration) {
      setIsRegistered(route.params.afterRegistration);
    }
  }, [route?.params?.afterRegistration]);

  const showToast = (message: string) => {
    ToastAndroid.showWithGravity(
      message,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  };

  const onSubmit = async (data: LoginSchemaType) => {
    try {
      setError('');
      const response = await login(data.email, data.password);

      if (response?.data?.success === true) {
        await notificationHandler();
        if (response?.data?.profileCompleted !== 1) {
          showToast('Login successful! Please complete your profile.');
          navigation.navigate('gettingUserDetails');
        }
      } else {
        setError('Invalid Credentials');
      }
    } catch (err: any) {
      console.log('LOGIN ERROR:', err);
      setError('Invalid Credentials');
    }
  };

  return (
    <View style={styles.main}>
      <ImageBackground style={styles.backgroundImage} source={AuthBackground}>
        <KeyboardShiftView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.cardContainer}>
            <Text style={styles.heading}>Log In</Text>

            <View style={styles.formContainer}>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.email?.message}
                    icon={
                      <EmailIcon
                        name="email"
                        size={moderateScale(22)}
                        color={COLORS.textLight}
                      />
                    }
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Password"
                    secureTextEntry
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.password?.message}
                    icon={
                      <LockIcon
                        name="lock"
                        size={moderateScale(22)}
                        color={COLORS.textLight}
                      />
                    }
                  />
                )}
              />
            </View>

            {error ? <Text style={styles.errorBanner}>{error}</Text> : null}

            <Button
              title="Log In"
              loading={isLoading}
              onPress={handleSubmit(onSubmit)}
              style={styles.loginBtn}
              icon={
                <ArrowRightIcon
                  name="arrow-right"
                  color={COLORS.white}
                  size={moderateScale(22)}
                />
              }
            />

            <View style={styles.bottomArea}>
              {isRegistered ? (
                <Text style={styles.registeredText}>
                  Successfully registered!{'\n'}Access your account by logging in.
                </Text>
              ) : (
                <View style={styles.registerPrompt}>
                  <Text style={styles.promptText}>Not registered yet?</Text>
                  <Pressable onPress={() => navigation.navigate('register')}>
                    <Text style={styles.registerLink}> Register</Text>
                  </Pressable>
                </View>
              )}
            </View>
          </View>
        </KeyboardShiftView>
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: deviceWidth,
    height: deviceHeight,
  },
  scrollContainer: {
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    minHeight: deviceHeight,
  },
  cardContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    borderRadius: RADIUS.lg,
    ...shadows.lg,
    marginTop: moderateScale(60),
  },
  heading: {
    ...TYPOGRAPHY.h1,
    alignSelf: 'center',
    marginBottom: spacing.lg,
    color: COLORS.secondary,
  },
  formContainer: {
    marginBottom: spacing.md,
  },
  errorBanner: {
    ...TYPOGRAPHY.body,
    color: COLORS.danger,
    alignSelf: 'center',
    marginBottom: spacing.md,
    fontWeight: '600',
  },
  loginBtn: {
    marginTop: spacing.sm,
    width: '100%',
  },
  bottomArea: {
    marginTop: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registeredText: {
    ...TYPOGRAPHY.body,
    color: COLORS.success,
    textAlign: 'center',
    fontWeight: '600',
  },
  registerPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  promptText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textLight,
  },
  registerLink: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});
