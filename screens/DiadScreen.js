import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useApp } from '../context/AppContext';
import { COLEGIOS } from '../data/colegios';

const C = { navy: '#0d1b3e', gold: '#c9973a', green: '#22c55e', red: '#ef4444', bg: '#f0f4fb', card: '#fff', muted: '#64748b', border: '#e2e8f0' };
const HORAS = ['8am', '10am', '12pm', '2pm', '4pm', '6pm'];

export default function DiadScreen() {
  const { votantes, actualizarVotante } = useApp();
  const [colegioSel, setColegioSel] = useState(null);

  const afiliados = votantes.filter(v => v.estado === 'afiliado');
  const votaron = afiliados.filter(v => v.voto).length;
  const pct = afiliados.length > 0 ? Math.round(votaron / afiliados.length * 100) : 0;

  function marcarVoto(id, hora) {
    actualizarVotante(id, { voto: hora, horaVoto: new Date().toISOString() });
  }

  const colegiosConAfil = COLEGIOS.map(c => ({
    ...c,
    afiliados: afiliados.filter(v => v.colegio === c.num),
    votaron: afiliados.filter(v => v.colegio === c.num && v.voto).length,
  })).filter(c => c.afiliados.length > 0);

  if (colegioSel) {
    const col = colegiosConAfil.find(c => c.num === colegioSel);
    return (
      <View style={s.container}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => setColegioSel(null)} style={s.backBtn}>
            <Text style={s.backTxt}>← Volver</Text>
          </TouchableOpacity>
          <Text style={s.title}>Colegio {col?.num}</Text>
          <Text style={s.sub}>{col?.recinto}</Text>
          <Text style={s.sub}>{col?.votaron}/{col?.afiliados.length} votaron</Text>
        </View>
        <FlatList
          data={col?.afiliados || []}
          keyExtractor={i => i.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          renderItem={({ item }) => (
            <View style={s.votCard}>
              <View style={{ flex: 1 }}>
                <Text style={s.nombre}>{item.nombre}</Text>
                {item.voto
                  ? <Text style={{ color: C.green, fontWeight: '700', fontSize: 12 }}>✓ Votó a las {item.voto}</Text>
                  : <Text style={{ color: C.muted, fontSize: 12 }}>Pendiente</Text>}
              </View>
              {!item.voto && (
                <View style={s.horaRow}>
                  {HORAS.map(h => (
                    <TouchableOpacity key={h} style={s.horaBtn} onPress={() => marcarVoto(item.id, h)}>
                      <Text style={s.horaTxt}>{h}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {item.voto && (
                <TouchableOpacity onPress={() => actualizarVotante(item.id, { voto: null })} style={s.desBtn}>
                  <Text style={s.desTxt}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      </View>
    );
  }

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.title}>🚨 Día D</Text>
        <Text style={s.sub}>Seguimiento en tiempo real</Text>
        <View style={s.statsRow}>
          <View style={[s.statPill, { backgroundColor: '#dcfce7' }]}>
            <Text style={[s.statNum, { color: '#166534' }]}>{votaron}</Text>
            <Text style={[s.statLbl, { color: '#166534' }]}>Votaron</Text>
          </View>
          <View style={[s.statPill, { backgroundColor: '#fef9c3' }]}>
            <Text style={[s.statNum, { color: '#713f12' }]}>{afiliados.length - votaron}</Text>
            <Text style={[s.statLbl, { color: '#713f12' }]}>Pendientes</Text>
          </View>
          <View style={[s.statPill, { backgroundColor: '#dbeafe' }]}>
            <Text style={[s.statNum, { color: '#1e40af' }]}>{pct}%</Text>
            <Text style={[s.statLbl, { color: '#1e40af' }]}>Flujo</Text>
          </View>
        </View>
        <View style={s.barWrap}>
          <View style={[s.barFill, { width: pct + '%' }]} />
        </View>
      </View>

      {colegiosConAfil.length === 0 ? (
        <View style={s.empty}><Text style={s.emptyTxt}>No hay afiliados aún para el Día D</Text></View>
      ) : (
        <FlatList
          data={colegiosConAfil}
          keyExtractor={i => i.num}
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          renderItem={({ item }) => {
            const pctCol = Math.round(item.votaron / item.afiliados.length * 100);
            return (
              <TouchableOpacity style={s.colCard} onPress={() => setColegioSel(item.num)}>
                <View style={s.colTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.colNum}>Colegio {item.num}</Text>
                    <Text style={s.colRecinto}>{item.recinto}</Text>
                  </View>
                  <Text style={s.colPct}>{pctCol}%</Text>
                </View>
                <View style={s.colBar}>
                  <View style={[s.colFill, { width: pctCol + '%', backgroundColor: pctCol >= 70 ? C.green : pctCol >= 40 ? C.gold : C.red }]} />
                </View>
                <Text style={s.colSub}>{item.votaron} de {item.afiliados.length} afiliados →</Text>
              </TouchableOpacity>
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
  backBtn: { marginBottom: 8 },
  backTxt: { color: C.navy, fontWeight: '600', fontSize: 14 },
  title: { fontSize: 20, fontWeight: '800', color: C.navy },
  sub: { fontSize: 12, color: C.muted, marginBottom: 4 },
  statsRow: { flexDirection: 'row', gap: 10, marginTop: 10, marginBottom: 10 },
  statPill: { flex: 1, borderRadius: 12, padding: 10, alignItems: 'center' },
  statNum: { fontSize: 22, fontWeight: '800' },
  statLbl: { fontSize: 10, fontWeight: '600', textTransform: 'uppercase' },
  barWrap: { height: 8, backgroundColor: '#e2e8f0', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: 8, backgroundColor: C.green, borderRadius: 4 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyTxt: { color: C.muted, fontSize: 14 },
  colCard: { backgroundColor: C.card, borderRadius: 12, padding: 14, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  colTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  colNum: { fontSize: 15, fontWeight: '700', color: C.navy },
  colRecinto: { fontSize: 11, color: C.muted },
  colPct: { fontSize: 20, fontWeight: '800', color: C.navy },
  colBar: { height: 6, backgroundColor: '#e2e8f0', borderRadius: 3, overflow: 'hidden', marginBottom: 6 },
  colFill: { height: 6, borderRadius: 3 },
  colSub: { fontSize: 11, color: C.muted },
  votCard: { backgroundColor: C.card, borderRadius: 10, padding: 12, marginBottom: 8, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  nombre: { fontSize: 14, fontWeight: '700', color: C.navy, marginBottom: 2 },
  horaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 6 },
  horaBtn: { borderWidth: 1.5, borderColor: C.border, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  horaTxt: { fontSize: 11, fontWeight: '600', color: C.muted },
  desBtn: { padding: 6 },
  desTxt: { color: C.red, fontWeight: '700' },
});
