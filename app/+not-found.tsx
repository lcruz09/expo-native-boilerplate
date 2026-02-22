import { ROUTES } from '@/constants/routes';
import { Link, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { useTranslation } from '@/hooks/localization/useTranslation';

const NotFoundScreen = () => {
  const { t } = useTranslation();
  return (
    <>
      <Stack.Screen options={{ title: t('notFound.title') }} />
      <View style={styles.container}>
        <Link href={ROUTES.HOME} style={styles.button}>
          {t('notFound.goHome')}
        </Link>
      </View>
    </>
  );
};

export default NotFoundScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
});
