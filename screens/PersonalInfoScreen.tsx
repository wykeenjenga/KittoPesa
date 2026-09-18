import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import { Bouncy } from '../components/Motion';
import ScreenHeader from '../components/ScreenHeader';
import { useAuth } from '../contexts/AuthContext';
import type { ProfileStackParamList } from '../navigation/types';
import { useTheme } from '../theme/ThemeContext';

type Props = NativeStackScreenProps<ProfileStackParamList, 'PersonalInfo'>;

export default function PersonalInfoScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [saved, setSaved] = useState(false);

  const save = () => {
    updateProfile(name.trim() || (user?.name ?? ''));
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenHeader title="Personal information" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.label, { color: colors.textMuted }]}>Full name</Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.surfaceAlt, color: colors.text, borderColor: colors.border },
          ]}
          value={name}
          onChangeText={setName}
        />

        <Text style={[styles.label, { color: colors.textMuted }]}>Email</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.surfaceAlt,
              color: colors.textMuted,
              borderColor: colors.border,
            },
          ]}
          value={user?.email ?? ''}
          editable={false}
        />
        <Text style={[styles.hint, { color: colors.textMuted }]}>
          Email can't be changed in this demo.
        </Text>

        <Bouncy
          style={[styles.button, { backgroundColor: colors.primaryButtonBg }]}
          onPress={save}
        >
          <Text style={[styles.buttonText, { color: colors.primaryButtonText }]}>
            {saved ? 'Saved ✓' : 'Save changes'}
          </Text>
        </Bouncy>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 20, paddingBottom: 40 },
  label: { fontSize: 12, fontWeight: '600', marginBottom: 6, marginTop: 14 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  hint: { fontSize: 11, marginTop: 6 },
  button: { borderRadius: 16, paddingVertical: 15, alignItems: 'center', marginTop: 28 },
  buttonText: { fontWeight: '700', fontSize: 15 },
});
