import {Actions} from 'react-native-router-flux';

/**
 * Navigates to the specified scene if it is not the current active scene.
 * This function is designed to address the issue of opening multiple pages
 * when the user rapidly clicks the navigate button.
 *
 * @param {string} destinationScene - The name of the scene to navigate to.
 * @param {object} props - Optional props to be passed to the destination scene.
 * @returns {void} - Returns nothing if the destination scene is the current active scene;
 *                   otherwise, navigates to the specified scene using React Native Router Flux.
 */
export const navigate = (destinationScene, props) => {
  if (Actions.currentScene === destinationScene) {
    return;
  }
  return Actions[destinationScene](props);
};
