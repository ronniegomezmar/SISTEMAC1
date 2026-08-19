import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useApp } from '../context/AppContext';
import { COLEGIOS } from '../data/colegios';

const C = { navy: '#0d1b3e', gold: '#c9973a', green: '#22c55e', red: '#ef4444', bg: '#f0f4fb', card: '#fff', muted: '#64748b', border: '#e2e8f0' };
const ZONAS = [...new Set(COLEGIOS.map(c => c.zona))];

const BADGE = {
  inscrito: { bg: '#fef9c3', color: '#713f12', txt: 'Inscrito' },
  afiliado: { bg: '#dcfce7', color: '#166534', txt: 'Afiliado ✓' },
  no_afiliado: { bg: '#fee2e2', color: '#991b1b', txt: 'No afiliado' },
};

export default function PadroncilloScreen() {
  const { votantes } = useApp();
  const [q, setQ] = useState('');
  const [zona, setZona] = useState('');
  const [estado, setEstado] = useState('');

  const datos = votantes.filter(v =>
    (!q || v.nombre.toLowerCase().includes(q.toLowerCase()) || v.cedula?.includes(q) || v.promotor?.toLowerCase().includes(q.toLowerCase())) &&
    (!zona || v.zona === zona) &&
    (!estado || v.estado === estado)
  );

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.title}>Padroncillo</Text>
        <Text style={s.sub}>{datos.length} de {votantes.length} registros</Text>
        <TextInput style={s.search} value={q} onChangeText={setQ} placeholder="🔍 Nombre, cédula o promotor..." placeholderTextColor="#94a3b8" />
        <View style={s.filtros}>
          {['', ...ZONAS].map(z => (
            <TouchableOpacity key={z} style={[s.chip, zona === z && s.chipActive]} onPress={() => setZona(z)}>
              <Text style={[s.chipTxt, zona === z && s.chipTxtActive]}>{z || 'Todas'}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={s.filtros}>
          {[['', 'Todos'], ['inscrito', 'Inscritos'], ['afiliado', 'Afiliados'], ['no_afiliado', 'No afiliados']].map(([v, l]) => (
            <TouchableOpacity key={v} style={[s.chip, estado === v && s.chipActive]} onPress={() => setEstado(v)}>
              <Text style={[s.chipTxt, estado === v && s.chipTxtActive]}>{l}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {votantes.length === 0 ? (
        <View style={s.empty}><Text style={s.emptyTxt}>Sin votantes registrados aún</Text></View>
      ) : (
        <FlatList
          data={datos}
          keyExtractor={i => i.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          renderItem={({ item, index }) => {
            const b = BADGE[item.estado] || BADGE.inscrito;
            return (
              <View style={s.row}>
                <Text style={s.num}>{index + 1}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={s.nombre}>{item.nombre}</Text>
                  <Text style={s.info}>Col. {item.colegio} · {item.promotor}</Text>
                  {item.cedula ? <Text style={s.info}>🪪 {item.cedula}</Text> : null}
                </View>
                <View style={[s.badge, { backgroundColor: b.bg }]}>
                  <Text style={[s.badgeTxt, { color: b.color }]}>{b.txt}</Text>
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: { backgroundColor: C.card, padding: 16, borderBottomWidth: 1, borderBottomColor: C.border },
  title: { fontSize: 20, fontWeight: '800', color: C.navy },
  sub: { fontSize: 12, color: C.muted, marginBottom: 10 },
  search: { borderWidth: 1.5, borderColor: C.border, borderRadius: 8, padding: 10, fontSize: 13, backgroundColor: '#fafafa', marginBottom: 8 },
  filtros: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginBottom: 6 },
  chip: { borderWidth: 1.5, borderColor: C.border, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  chipActive: { backgroundColor: C.navy, borderColor: C.navy },
  chipTxt: { fontSize: 11, fontWeight: '600', color: C.muted },
  chipTxtActive: { color: '#fff' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyTxt: { color: C.muted, fontSize: 14 },
  row: { backgroundColor: C.card, borderRadius: 10, padding: 12, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  num: { fontSize: 12, color: C.muted, width: 24, textAlign: 'right' },
  nombre: { fontSize: 14, fontWeight: '700', color: C.navy },
  info: { fontSize: 11, color: C.muted, marginTop: 1 },
  badge: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  badgeTxt: { fontSize: 10, fontWeight: '700' },
});
