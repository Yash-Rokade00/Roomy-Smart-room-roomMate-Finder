import React, { useState } from 'react';
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
import PhoneIcon from 'react-native-vector-icons/Feather';
import UserIcon from 'react-native-vector-icons/Feather';
import ArrowRightIcon from 'react-native-vector-icons/Feather';
import ArrowLeftIcon from 'react-native-vector-icons/Feather';

import AuthBackground from '../../../assets/Images/AuthBackground.jpg';
import API from '../../../services/api/api';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { KeyboardShiftView } from '../../../components/layouts/KeyboardShiftView';
import { COLORS, TYPOGRAPHY, RADIUS } from '../../../theme/theme';
import { deviceHeight, deviceWidth, moderateScale, spacing, shadows } from '../../../utils/responsive';

// Zod Registration Schema with Password confirmation validation
const registrationSchema = z
  .object({
    name: z.string().min(2, 'Full Name must be at least 2 characters'),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm password is required'),
    contactNo: z
      .string()
      .min(10, 'Contact number must be exactly 10 digits')
      .max(10, 'Contact number must be exactly 10 digits')
      .regex(/^\d+$/, 'Contact number must contain digits only'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegistrationSchemaType = z.infer<typeof registrationSchema>;

interface RegistrationScreenProps {
  navigation: any;
}

const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ navigation }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string>('');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationSchemaType>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      contactNo: '',
    },
  });

  const showToast = (message: string) => {
    ToastAndroid.showWithGravity(
      message,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  };

  const onSubmit = async (data: RegistrationSchemaType) => {
    setLoading(true);
    setApiError('');
    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        contactNo: data.contactNo,
      };

      console.log('Registering Payload:', payload);
      const res = await API.post('/auth/signUp', payload);
      console.log('Registration Response:', res.data);

      if (res?.data?.success === true) {
        showToast('Registration successful! Please login.');
        navigation.navigate('login', { afterRegistration: true });
      } else {
        setApiError(res?.data?.message || 'Registration failed');
      }
    } catch (err: any) {
      console.log('REGISTRATION ERROR:', err);
      setApiError(err?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.main}>
      <ImageBackground style={styles.backgroundImage} source={AuthBackground}>
        <KeyboardShiftView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.cardContainer}>
            <View style={styles.headerRow}>
              <Pressable
                style={styles.backButton}
                onPress={() => navigation.navigate('login')}
              >
                <ArrowLeftIcon
                  name="arrow-left"
                  color={COLORS.primary}
                  size={moderateScale(20)}
                />
                <Text style={styles.backText}>Back to Login</Text>
              </Pressable>
            </View>

            <Text style={styles.title}>Sign Up / Register</Text>

            <View style={styles.formContainer}>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Full Name"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.name?.message}
                    icon={
                      <UserIcon
                        name="user"
                        size={moderateScale(22)}
                        color={COLORS.textLight}
                      />
                    }
                  />
                )}
              />

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

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Confirm Password"
                    secureTextEntry
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.confirmPassword?.message}
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

              <Controller
                control={control}
                name="contactNo"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Mobile No"
                    keyboardType="numeric"
                    maxLength={10}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.contactNo?.message}
                    icon={
                      <PhoneIcon
                        name="phone"
                        size={moderateScale(22)}
                        color={COLORS.textLight}
                      />
                    }
                  />
                )}
              />
            </View>

            {apiError ? <Text style={styles.errorBanner}>{apiError}</Text> : null}

            <Button
              title="Sign Up / Register"
              loading={loading}
              onPress={handleSubmit(onSubmit)}
              style={styles.registerBtn}
              icon={
                <ArrowRightIcon
                  name="arrow-right"
                  color={COLORS.white}
                  size={moderateScale(22)}
                />
              }
            />
          </View>
        </KeyboardShiftView>
      </ImageBackground>
    </View>
  );
};

export default RegistrationScreen;

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
    marginTop: moderateScale(40),
  },
  headerRow: {
    marginBottom: spacing.md,
    alignItems: 'flex-start',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  backText: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
    fontWeight: '600',
  },
  title: {
    ...TYPOGRAPHY.h1,
    fontSize: moderateScale(28),
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
  registerBtn: {
    marginTop: spacing.sm,
    width: '100%',
  },
});
