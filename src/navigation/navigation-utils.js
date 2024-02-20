import {useState, useEffect, useRef} from 'react';
import {color} from '../theme';

// Methods on the ref - https://reactnavigation.org/docs/navigation-container
export const RootNavigation = {
  navigate() {},
  goBack() {},
  // The resetRoot method lets you reset the state of the navigation tree to the specified state object
  resetRoot() {},
  //The getRootState method returns the current navigation state containing the navigation states for all navigators in the navigation tree
  getRootState() {},
  //The getCurrentRoute method returns the route object for the currently focused screen in the whole navigation tree
  getCurrentRoute() {},
};

export const setRootNavigation = ref => {
  const getMethod = (method, ...args) => {
    return function (...args) {
      if (ref.current) {
        return ref.current[method](...args);
      }
    };
  };
  for (const method in RootNavigation) {
    RootNavigation[method] = getMethod(method);
  }
};

/**
 * Gets the current screen from any navigation state.
 */
function getActiveRouteName(state) {
  const route = state.routes[state.index];
  // Found the active route -- return the name
  if (!route.state) {
    return route.name;
  }
  // Recursive call to deal with nested routers
  return getActiveRouteName(route.state);
}

/**
 * Custom hook for persisting navigation state.
 */
export function useNavigationPersistence(storage, persistenceKey) {
  const [initialNavigationState, setInitialNavigationState] = useState();
  const [isRestoringNavigationState, setIsRestoringNavigationState] =
    useState(false);
  const routeNameRef = useRef();
  const onNavigationStateChange = state => {
    const previousRouteName = routeNameRef.current;
    const currentRouteName = getActiveRouteName(state);
    if (previousRouteName !== currentRouteName) {
      // track screens.
    }
    // Save the current route name for later comparison
    routeNameRef.current = currentRouteName;
    // Persist state to storage
    storage.save(persistenceKey, state);
  };

  const restoreState = async () => {
    try {
      const state = await storage.load(persistenceKey);
      if (state) {
        setInitialNavigationState(state);
      }
    } finally {
      setIsRestoringNavigationState(false);
    }
  };

  useEffect(() => {
    if (isRestoringNavigationState) {
      restoreState();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRestoringNavigationState]);

  return {
    onNavigationStateChange,
    restoreState,
    initialNavigationState,
    RootNavigation,
  };
}

export const dialogOptions = {
  headerShown: false,
  // cardStyle: {backgroundColor: 'transparent'},
  presentation: 'transparentModal',
  cardOverlayEnabled: true,
  cardStyleInterpolator: ({current: {progress}}) => ({
    cardStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
    },
    overlayStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.5],
        extrapolate: 'clamp',
      }),
      backgroundColor: color.palette.black,
    },
  }),
};

//Todo: Remove this
export const popoverOptions = {
  headerShown: false,
  cardStyle: {backgroundColor: 'transparent'},
  cardOverlayEnabled: true,
  cardStyleInterpolator: ({current: {progress}}) => ({
    cardStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 0.5, 0.9, 1],
        outputRange: [0, 0.25, 0.7, 1],
      }),
      transform: [
        {
          scale: progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0.9, 1],
            extrapolate: 'clamp',
          }),
        },
      ],
    },
  }),
};
