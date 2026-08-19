import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useApp } from '../context/AppContext';

const C = { navy: '#0d1b3e', gold: '#c9973a', green: '#22c55e', red: '#ef4444', bg: '#f0f4fb', card: '#fff', muted: '#64748b', border: '#e2e8f0' };

const ESTADOS = {
  inscrito: { label: 'Pendiente', bg: '#fef9c3', color: '#713f12' },
  afiliado: { label: 'Afiliado ✓', bg: '#dcfce7', color: '#166534' },
  no_afiliado: { label: 'No afiliado', bg: '#fee2e2', color: '#991b1b' },
};

function dias(fecha) {
  const d = Math.floor((Date.now() - new Date(fecha).getTime()) / 86400000);
  return d === 0 ? 'hoy' : d === 1 ? 'ayer' : `hace ${d}d`;
}

export default function VerificacionScreen() {
  const { votantes, actualizarVotante, stats } = useApp();
  const [filtro, setFiltro] = useState('');
  const [solosPendientes, setSolosPendientes] = useState(false);

  const datos = votantes
    .filter(v => !solosPendientes || v.estado === 'inscrito')
    .filter(v => !filtro || v.nombre.toLowerCase().includes(filtro.toLowerCase()) || v.promotor?.toLowerCase().includes(filtro.toLowerCase()));

  function marcar(id, estado) {
    actualizarVotante(id, { estado, fechaVerif: new Date().toISOString() });
  }

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.title}>Verificación</Text>
        <Text style={s.sub}>Llamada de confirmación a los 3 días</Text>
        <View style={s.statRow}>
          <View style={s.pill}><Text style={[s.pillTxt, { color: '#713f12' }]}>⏳ {stats.pendientes} pendientes</Text></View>
          <View style={[s.pill, { backgroundColor: '#dcfce7' }]}><Text style={[s.pillTxt, { color: '#166534' }]}>✓ {stats.afiliados} afiliados</Text></View>
          <View style={[s.pill, { backgroundColor: '#fee2e2' }]}><Text style={[s.pillTxt, { color: '#991b1b' }]}>✗ {stats.noAfiliados} no</Text></View>
        </View>
        <TextInput style={s.search} value={filtro} onChangeText={setFiltro} placeholder="🔍 Buscar nombre o promotor..." placeholderTextColor="#94a3b8" />
        <TouchableOpacity style={[s.toggle, solosPendientes && s.toggleActive]} onPress={() => setSolosPendientes(p => !p)}>
          <Text style={[s.toggleTxt, solosPendientes && { color: '#fff' }]}>Solo pendientes</Text>
        </TouchableOpacity>
      </View>

      {votantes.length === 0 ? (
        <View style={s.empty}><Text style={s.emptyTxt}>Sin votantes registrados aún</Text></View>
      ) : (
        <FlatList
          data={datos}
          keyExtractor={i => i.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          renderItem={({ item }) => {
            const est = ESTADOS[item.estado] || ESTADOS.inscrito;
            return (
              <View style={s.card}>
                <View style={s.cardTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.nombre}>{item.nombre}</Text>
                    <Text style={s.info}>Colegio {item.colegio} · {item.promotor}</Text>
                    {item.telefono ? <Text style={s.info}>📞 {item.telefono}</Text> : null}
                    <Text style={s.fecha}>Registrado {dias(item.fecha)}</Text>
                  </View>
                  <View style={[s.badge, { backgroundColor: est.bg }]}>
                    <Text style={[s.badgeTxt, { color: est.color }]}>{est.label}</Text>
                  </View>
                </View>
                {item.estado === 'inscrito' && (
                  <View style={s.btnRow}>
                    <TouchableOpacity style={s.btnAfil} onPress={() => marcar(item.id, 'afiliado')}>
                      <Text style={s.btnAfilTxt}>✓ Afiliado</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={s.btnNo} onPress={() => marcar(item.id, 'no_afiliado')}>
                      <Text style={s.btnNoTxt}>✗ No afiliado</Text>
                    </TouchableOpacity>
                  </View>
                )}
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
  statRow: { flexDirection: 'row', gap: 8, marginBottom: 10, flexWrap: 'wrap' },
  pill: { backgroundColor: '#fef9c3', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  pillTxt: { fontSize: 12, fontWeight: '600' },
  search: { borderWidth: 1.5, borderColor: C.border, borderRadius: 8, padding: 10, fontSize: 13, backgroundColor: '#fafafa', marginBottom: 8 },
  toggle: { alignSelf: 'flex-start', borderWidth: 1.5, borderColor: C.navy, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  toggleActive: { backgroundColor: C.navy },
  toggleTxt: { fontSize: 12, fontWeight: '600', color: C.navy },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyTxt: { color: C.muted, fontSize: 14 },
  card: { backgroundColor: C.card, borderRadius: 12, padding: 14, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start' },
  nombre: { fontSize: 15, fontWeight: '700', color: C.navy },
  info: { fontSize: 12, color: C.muted, marginTop: 2 },
  fecha: { fontSize: 11, color: '#94a3b8', marginTop: 3 },
  badge: { borderRadius: 20, paddingHorizontal: 9, paddingVertical: 3, marginLeft: 8 },
  badgeTxt: { fontSize: 11, fontWeight: '700' },
  btnRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  btnAfil: { flex: 1, backgroundColor: C.green, borderRadius: 8, padding: 9, alignItems: 'center' },
  btnAfilTxt: { color: '#fff', fontWeight: '700', fontSize: 13 },
  btnNo: { flex: 1, backgroundColor: '#fee2e2', borderRadius: 8, padding: 9, alignItems: 'center' },
  btnNoTxt: { color: C.red, fontWeight: '700', fontSize: 13 },
});
