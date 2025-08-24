# Mes Bonnes Pratiques pour Débuter avec React Native

Bienvenue dans mon aventure avec React Native ! Comme je viens d'un environnement React et Next.js, j'ai déjà une base solide. Voici ce que je retiens pour construire ma première application React Native :
npx expo start --port 19001 pour lancer le projet avec expo

---

## 1. **Architecture de Mon Projet**

### Ma Structure de Dossiers :
- **`components/`** : Mes composants réutilisables de l'interface utilisateur (ex. : `Button`, `Card`, `Header`).
- **`screens/`** : Les écrans ou pages de mon application (ex. : `HomeScreen`, `TaskScreen`).
- **`navigation/`** : La configuration de la navigation (ex. : `StackNavigator`, `TabNavigator`).
- **`assets/`** : Mes ressources statiques comme les images, polices et icônes.
- **`hooks/`** : Mes hooks personnalisés pour la logique partagée (ex. : `useTheme`, `useAuth`).
- **`constants/`** : Les constantes globales de mon application (ex. : couleurs, polices, points d'API).
- **`utils/`** : Mes fonctions utilitaires (ex. : `formatDate`, `calculatePercentage`).
- **`styles/`** : Mes feuilles de styles ou fichiers de thème partagés.

### Pourquoi ?
- Cette structure m'aide à garder mon code modulaire, évolutif et facile à maintenir.

---

## 2. **Conception de Mes Composants**

### Ce que Je Fais :
- **Je Garde Mes Composants Petits et Focalisés** : Chaque composant doit faire une seule chose correctement.
- **J'Utilise des Composants Fonctionnels** : J'exploite les hooks React comme `useState` et `useEffect`.
- **Je Sépare les Styles** : J'utilise `StyleSheet.create` pour les styles ou des bibliothèques comme `styled-components`.
- **Je Passe les Données via les Props** : Cela rend mes composants réutilisables.

### Exemple :
```tsx
// components/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

type ButtonProps = {
  title: string;
  onPress: () => void;
};

const Button: React.FC<ButtonProps> = ({ title, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.text}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Button;
```

---

## 3. **Mes Styles**

### Ce que Je Fais :
- **J'Utilise Flexbox** : React Native utilise Flexbox pour la mise en page. J'apprends `justifyContent`, `alignItems` et `flex`.
- **J'Évite les Styles Inline** : J'utilise `StyleSheet.create` pour de meilleures performances.
- **Je Pense au Design Réactif** : J'utilise des pourcentages, `Dimensions` ou des bibliothèques comme `react-native-size-matters`.
- **Je Centralise les Couleurs et Polices** : Tout est dans un fichier `theme`.

### Exemple :
```tsx
// constants/Colors.ts
export default {
  primary: '#007bff',
  secondary: '#6c757d',
  success: '#28a745',
  danger: '#dc3545',
  warning: '#ffc107',
  info: '#17a2b8',
  light: '#f8f9fa',
  dark: '#343a40',
};
```

---

## 4. **Navigation**

### Ce Que J'Utilise :
- J'utilise `react-navigation` pour la navigation.

### Mes Conseils :
- **Stack Navigator** : Pour la navigation d'écran en écran.
- **Tab Navigator** : Pour les onglets en bas.
- **Drawer Navigator** : Pour les menus latéraux.
- **Deep Linking** : Je configure le deep linking pour les URL externes.

### Exemple :
```tsx
// navigation/AppNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import TaskScreen from '../screens/TaskScreen';

const Stack = createStackNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Task" component={TaskScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
```

---

## 5. **Gestion de Mon État**

### Ce Que Je Fais :
- **Pour l'État Local** : J'utilise `useState` et `useReducer` pour les applications simples.
- **Pour l'État Global** : J'utilise `Context API` ou des bibliothèques comme `Redux` ou `Zustand`.
- **Pour le Stockage Asynchrone** : J'utilise `@react-native-async-storage/async-storage` pour le stockage persistant.

### Exemple :
```tsx
// hooks/useTasks.ts
import { useState } from 'react';

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = (title: string) => {
    const newTask = { id: Date.now().toString(), title, completed: false };
    setTasks([...tasks, newTask]);
  };

  return { tasks, addTask };
};

export default useTasks;
```

---

## 6. **Optimisation des Performances**

### Ce Que Je Fais :
- **J'Évite les Fonctions Anonymes** : Je définis les fonctions en dehors du `render`.
- **J'Utilise FlatList** : Pour afficher efficacement de grandes listes.
- **J'Optimise les Images** : J'utilise des tailles et formats appropriés.
- **Je Mémorise** : J'utilise `React.memo` et `useCallback`.

---

## 7. **Mes Outils de Débogage**

### Ce Que J'Utilise :
- **React Native Debugger** : Pour inspecter l'état et les requêtes réseau.
- **Flipper** : Une plateforme de débogage pour React Native.
- **Expo Go** : Pour des tests rapides sur les appareils.

---

## 8. **Tests**

### Ce Que J'Utilise :
- **Tests Unitaires** : J'utilise `Jest`.
- **Tests d'Intégration** : J'utilise `React Native Testing Library`.
- **Tests End-to-End** : J'utilise `Detox`.

---

## 9. **Déploiement**

### Ce Que Je Fais :
- **Pour Android** : J'utilise `gradlew assembleRelease`.
- **Pour iOS** : J'utilise Xcode ou `fastlane`.
- **Avec Expo** : J'utilise `expo build` pour les workflows gérés.

---

## 10. **Mes Ressources d'Apprentissage**

### Ce Que Je Consulte :
- **Documentation Officielle** : [React Native](https://reactnative.dev/docs/getting-started)
- **Cours** : Plateformes comme Udemy, Pluralsight ou YouTube.
- **Communauté** : Je rejoins les forums React Native et les discussions GitHub.

---

Je suis prêt à coder ! 🚀
