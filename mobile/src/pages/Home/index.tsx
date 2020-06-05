import React, { useCallback, useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { View, ImageBackground, Image, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-community/picker';
import axios from 'axios';

import styles from "./styles";

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const Home: React.FC = () => {
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [selectedUf, setSelectedUf] = useState<React.ReactText>('0');
  const [selectedCity, setSelectedCity] = useState<React.ReactText>('0');

  const navigation = useNavigation();

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(({ data }) => {
      const ufInitials = data.map(uf => uf.sigla);
      setUfs(ufInitials);
    });
  }, []);

  useEffect(() => {
    if (selectedUf === '0') {
      return;
    }

    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(({ data }) => {
      const cityNames = data.map(city => city.nome);
      setCities(cityNames);
    });
  }, [selectedUf]);

  const handleNavigateToPoints = useCallback(() => {
    navigation.navigate('Points', {
      uf: selectedUf,
      city: selectedCity
    });
  }, [selectedUf, selectedCity]);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios'? 'padding' : undefined}>
      <ImageBackground
        source={require('../../assets/home-background.png')}
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />
          <View>
            <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Picker
            selectedValue={selectedUf}
            style={styles.input}
            onValueChange={(value) => setSelectedUf(value)}
          >
            <Picker.Item label="Selecione o estado" value="0" />

            {ufs.map(item => (
              <Picker.Item key={item} label={item} value={item} />
            ))}
          </Picker>

          <Picker
            selectedValue={selectedCity}
            style={styles.input}
            onValueChange={(value) => setSelectedCity(value)}
          >
            <Picker.Item label="Selecione a cidade" value="0" />

            {cities.map(item => (
              <Picker.Item key={item} label={item} value={item} />
            ))}
          </Picker>

          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#fff" size={24} />
              </Text>
            </View>
            <Text style={styles.buttonText}>
              Entrar
            </Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default Home;