import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useApp } from '../context/AppContext';
import { COLEGIOS } from '../data/colegios';

const C = { navy: '#0d1b3e', gold: '#c9973a', green: '#22c55e', red: '#ef4444', blue: '#3b82f6', bg: '#f0f4fb', card: '#fff', muted: '#64748b' };

function StatCard({ label, value, color, sub }) {
  return (
    <View style={[s.statCard, { borderLeftColor: color || C.gold }]}>
      <Text style={s.statLabel}>{label}</Text>
      <Text style={[s.statValue, { color: C.navy }]}>{value}</Text>
      {sub ? <Text style={s.statSub}>{sub}</Text> : null}
    </View>
  );
}

export default function ResumenScreen() {
  const { votantes, stats } = useApp();
  const conv = stats.afiliados > 0 && stats.inscritos > 0
    ? Math.round(stats.afiliados / stats.inscritos * 100) : 0;

  const colegiosConInscritos = COLEGIOS.map(c => ({
    ...c,
    inscritos: votantes.filter(v => v.colegio === c.num).length,
  }));

  return (
    <ScrollView style={s.scroll} contentContainerStyle={s.container}>
      <Text style={s.title}>Circunscripción 1</Text>
      <Text style={s.sub}>Sistema 1×10 — Ronnie Gómez</Text>

      <View style={s.grid2}>
        <StatCard label="Inscritos" value={stats.inscritos.toLocaleString()} color={C.navy} />
        <StatCard label="Afiliados ✓" value={stats.afiliados.toLocaleString()} color={C.green} />
        <StatCard label="Conversión" value={conv + '%'} color={C.blue} sub="inscritos → afiliados" />
        <StatCard label="Promotores" value={stats.promotores} color={C.gold} />
      </View>

      <Text style={s.sectionTitle}>Colegios Electorales</Text>
      <View style={s.mosaico}>
        {colegiosConInscritos.map(c => (
          <View
            key={c.num}
            style={[s.mosaicCell, { backgroundColor: c.inscritos >= 10 ? C.green : c.inscritos > 0 ? C.gold : C.navy }]}
          >
            <Text style={s.mosaicNum}>{c.num}</Text>
            <Text style={s.mosaicSub}>{c.inscritos > 0 ? '✓' + c.inscritos : '—'}</Text>
          </View>
        ))}
      </View>

      <View style={s.legend}>
        <View style={s.legendItem}><View style={[s.dot, { backgroundColor: C.navy }]} /><Text style={s.legendTxt}>Sin inscritos</Text></View>
        <View style={s.legendItem}><View style={[s.dot, { backgroundColor: C.gold }]} /><Text style={s.legendTxt}>1–9</Text></View>
        <View style={s.legendItem}><View style={[s.dot, { backgroundColor: C.green }]} /><Text style={s.legendTxt}>10+</Text></View>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: C.bg },
  container: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 22, fontWeight: '800', color: C.navy, marginTop: 8 },
  sub: { fontSize: 13, color: C.muted, marginBottom: 16 },
  grid2: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  statCard: { backgroundColor: C.card, borderRadius: 12, padding: 14, borderLeftWidth: 4, width: '47%', shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 },
  statLabel: { fontSize: 11, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  statValue: { fontSize: 26, fontWeight: '800' },
  statSub: { fontSize: 10, color: C.muted, marginTop: 2 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: C.navy, marginBottom: 10 },
  mosaico: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  mosaicCell: { borderRadius: 8, padding: 8, alignItems: 'center', width: 60 },
  mosaicNum: { color: '#fff', fontWeight: '700', fontSize: 13 },
  mosaicSub: { color: 'rgba(255,255,255,0.85)', fontSize: 10, marginTop: 2 },
  legend: { flexDirection: 'row', gap: 14, marginTop: 6 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dot: { width: 10, height: 10, borderRadius: 3 },
  legendTxt: { fontSize: 11, color: C.muted },
});
