import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { AppProvider } from './context/AppContext';
import ResumenScreen from './screens/ResumenScreen';
import RegistroScreen from './screens/RegistroScreen';
import VerificacionScreen from './screens/VerificacionScreen';
import PadroncilloScreen from './screens/PadroncilloScreen';
import DiadScreen from './screens/DiadScreen';

const Tab = createBottomTabNavigator();

const C = { navy: '#0d1b3e', gold: '#c9973a' };

function Icon({ name, focused }) {
  const icons = {
    Resumen: '📊',
    Registro: '✍️',
    Verificación: '📞',
    Padroncillo: '📋',
    'Día D': '🚨',
  };
  return <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{icons[name]}</Text>;
}

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused }) => <Icon name={route.name} focused={focused} />,
            tabBarActiveTintColor: C.gold,
            tabBarInactiveTintColor: '#64748b',
            tabBarStyle: {
              backgroundColor: C.navy,
              borderTopWidth: 0,
              paddingBottom: 4,
              height: 60,
            },
            tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
            headerStyle: { backgroundColor: C.navy },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: '700' },
          })}
        >
          <Tab.Screen name="Resumen" component={ResumenScreen} />
          <Tab.Screen name="Registro" component={RegistroScreen} />
          <Tab.Screen name="Verificación" component={VerificacionScreen} />
          <Tab.Screen name="Padroncillo" component={PadroncilloScreen} />
          <Tab.Screen name="Día D" component={DiadScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}
