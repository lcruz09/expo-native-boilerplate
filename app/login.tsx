import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { Pressable } from '@/components/atoms/Pressable';
import { PageLayout } from '@/components/organisms/PageLayout';
import { useAuth } from '@/hooks/api/useAuth';
import {
  useTranslation,
  type TranslationKey,
  type TranslationOptions,
} from '@/hooks/localization/useTranslation';
import { useColors } from '@/hooks/theme/useColors';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View } from 'react-native';
import { z } from 'zod';

const createLoginSchema = (t: (key: TranslationKey, options?: TranslationOptions) => string) =>
  z.object({
    email: z.string().email(t('auth.login.errors.invalidEmail')),
    password: z
      .string()
      .min(8, t('auth.login.errors.passwordLength'))
      .regex(/[A-Z]/, t('auth.login.errors.passwordUppercase'))
      .regex(/[a-z]/, t('auth.login.errors.passwordLowercase'))
      .regex(/[0-9]/, t('auth.login.errors.passwordNumber')),
  });

type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;

export default function LoginScreen() {
  const colors = useColors();
  const router = useRouter();
  const { t } = useTranslation();
  const { login, isLoading } = useAuth();
  const [serverError, setServerError] = React.useState<string | null>(null);

  const loginSchema = React.useMemo(() => createLoginSchema(t), [t]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setServerError(null);
      await login(data);
      router.replace('/');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An error occurred during login';
      setServerError(message);
    }
  };

  return (
    <PageLayout hasSafeAreaTop hasTabBar={false}>
      <View className="px-4 py-2">
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full active:bg-zinc-100 dark:active:bg-zinc-800"
        >
          <Icon name="chevron-back" color={colors.text.primary} />
        </Pressable>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
          <View className="flex-1 px-6 pt-4">
            <View className="mb-10">
              <Text className="mb-2 text-3xl font-bold" style={{ color: colors.text.primary }}>
                {t('auth.login.title')}
              </Text>
              <Text className="text-base opacity-60" style={{ color: colors.text.secondary }}>
                {t('auth.login.subtitle')}
              </Text>
            </View>

            <View className="space-y-6">
              <View>
                <Text
                  className="mb-2 ml-1 text-sm font-semibold"
                  style={{ color: colors.text.secondary }}
                >
                  {t('auth.login.emailLabel')}
                </Text>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      testID="email-input"
                      className="h-14 w-full rounded-2xl bg-zinc-100 px-4 text-base dark:bg-zinc-900"
                      style={{ color: colors.text.primary }}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder={t('auth.login.emailPlaceholder')}
                      placeholderTextColor={colors.text.secondary + '80'}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                    />
                  )}
                />
                {errors.email && (
                  <Text className="ml-1 mt-1 text-xs text-red-500">{errors.email.message}</Text>
                )}
              </View>

              <View>
                <Text
                  className="mb-2 ml-1 text-sm font-semibold"
                  style={{ color: colors.text.secondary }}
                >
                  {t('auth.login.passwordLabel')}
                </Text>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      testID="password-input"
                      className="h-14 w-full rounded-2xl bg-zinc-100 px-4 text-base dark:bg-zinc-900"
                      style={{ color: colors.text.primary }}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder={t('auth.login.passwordPlaceholder')}
                      placeholderTextColor={colors.text.secondary + '80'}
                      secureTextEntry
                      autoCapitalize="none"
                    />
                  )}
                />
                {errors.password && (
                  <Text className="ml-1 mt-1 text-xs leading-4 text-red-500">
                    {errors.password.message}
                  </Text>
                )}
              </View>

              {serverError && (
                <View className="rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/30">
                  <Text className="text-center text-sm font-medium text-red-600 dark:text-red-400">
                    {serverError}
                  </Text>
                </View>
              )}

              <View className="pt-4">
                <Button
                  onPress={handleSubmit(onSubmit)}
                  variant="primary"
                  size="large"
                  loading={isLoading}
                >
                  {t('auth.login.submitButton')}
                </Button>
              </View>
            </View>

            <View className="mt-auto items-center pb-8">
              <Text className="text-sm opacity-60" style={{ color: colors.text.secondary }}>
                {t('auth.login.noAccount')}{' '}
                <Text className="font-bold" style={{ color: colors.primary }} onPress={() => {}}>
                  {t('auth.login.contactSupport')}
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </PageLayout>
  );
}
