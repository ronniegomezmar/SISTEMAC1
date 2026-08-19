import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useApp } from '../context/AppContext';
import { COLEGIOS } from '../data/colegios';

const C = { navy: '#0d1b3e', gold: '#c9973a', green: '#22c55e', bg: '#f0f4fb', card: '#fff', muted: '#64748b', border: '#e2e8f0' };

function Field({ label, children }) {
  return (
    <View style={s.field}>
      <Text style={s.label}>{label}</Text>
      {children}
    </View>
  );
}

export default function RegistroScreen() {
  const { agregarVotante, coordinadores } = useApp();
  const [form, setForm] = useState({ nombre: '', cedula: '', telefono: '', colegio: '', zona: '', coordinador: '', promotor: '' });
  const [guardando, setGuardando] = useState(false);

  function setF(k, v) {
    if (k === 'colegio') {
      const col = COLEGIOS.find(c => c.num === v);
      setForm(f => ({ ...f, colegio: v, zona: col?.zona || '' }));
    } else {
      setForm(f => ({ ...f, [k]: v }));
    }
  }

  async function guardar() {
    if (!form.nombre.trim()) { Alert.alert('Falta el nombre'); return; }
    if (!form.colegio) { Alert.alert('Selecciona el colegio'); return; }
    if (!form.promotor.trim()) { Alert.alert('Falta el promotor'); return; }
    setGuardando(true);
    await agregarVotante(form);
    setForm({ nombre: '', cedula: '', telefono: '', colegio: '', zona: '', coordinador: '', promotor: '' });
    setGuardando(false);
    Alert.alert('✓ Registrado', 'Votante inscrito exitosamente');
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={s.scroll} contentContainerStyle={s.container}>
        <Text style={s.title}>Registrar Votante</Text>
        <Text style={s.sub}>Sistema 1×10 — cada promotor registra 10 votantes</Text>

        <View style={s.card}>
          <Field label="Nombre completo *">
            <TextInput style={s.input} value={form.nombre} onChangeText={v => setF('nombre', v)} placeholder="Ej. Juan Pérez" placeholderTextColor="#94a3b8" />
          </Field>
          <Field label="Cédula">
            <TextInput style={s.input} value={form.cedula} onChangeText={v => setF('cedula', v)} placeholder="000-0000000-0" keyboardType="numeric" placeholderTextColor="#94a3b8" />
          </Field>
          <Field label="Teléfono">
            <TextInput style={s.input} value={form.telefono} onChangeText={v => setF('telefono', v)} placeholder="809-000-0000" keyboardType="phone-pad" placeholderTextColor="#94a3b8" />
          </Field>

          <Field label="Colegio electoral *">
            <View style={s.pickerWrap}>
              <Picker selectedValue={form.colegio} onValueChange={v => setF('colegio', v)} style={s.picker}>
                <Picker.Item label="— Seleccionar colegio —" value="" />
                {COLEGIOS.map(c => (
                  <Picker.Item key={c.num} label={`${c.num} — ${c.recinto}`} value={c.num} />
                ))}
              </Picker>
            </View>
          </Field>

          {form.zona ? (
            <View style={s.zonaTag}>
              <Text style={s.zonaTagTxt}>📍 {form.zona}</Text>
            </View>
          ) : null}

          <Field label="Coordinador">
            <View style={s.pickerWrap}>
              <Picker selectedValue={form.coordinador} onValueChange={v => setF('coordinador', v)} style={s.picker}>
                <Picker.Item label="— Seleccionar coordinador —" value="" />
                {coordinadores.map(c => (
                  <Picker.Item key={c.id} label={c.nombre} value={c.nombre} />
                ))}
              </Picker>
            </View>
          </Field>

          <Field label="Promotor *">
            <TextInput style={s.input} value={form.promotor} onChangeText={v => setF('promotor', v)} placeholder="Nombre del promotor" placeholderTextColor="#94a3b8" />
          </Field>

          <TouchableOpacity style={[s.btn, guardando && { opacity: 0.6 }]} onPress={guardar} disabled={guardando}>
            <Text style={s.btnTxt}>{guardando ? 'Guardando...' : '+ Registrar Votante'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: C.bg },
  container: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 20, fontWeight: '800', color: C.navy, marginTop: 8 },
  sub: { fontSize: 12, color: C.muted, marginBottom: 16 },
  card: { backgroundColor: C.card, borderRadius: 14, padding: 16, shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 6, elevation: 3 },
  field: { marginBottom: 14 },
  label: { fontSize: 11, fontWeight: '700', color: C.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 5 },
  input: { borderWidth: 1.5, borderColor: C.border, borderRadius: 8, padding: 11, fontSize: 15, color: '#1e293b', backgroundColor: '#fafafa' },
  pickerWrap: { borderWidth: 1.5, borderColor: C.border, borderRadius: 8, backgroundColor: '#fafafa', overflow: 'hidden' },
  picker: { height: 50, color: '#1e293b' },
  zonaTag: { backgroundColor: '#fef3c7', borderRadius: 8, padding: 8, marginBottom: 14 },
  zonaTagTxt: { fontSize: 12, color: '#92400e', fontWeight: '600' },
  btn: { backgroundColor: C.navy, borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 6 },
  btnTxt: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
