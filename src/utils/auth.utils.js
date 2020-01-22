/**
 * Chaerus Sulton
 * chaerussulton@gmail.com
 * PT Edgeworks
 */

import {Alert} from 'react-native';
import colorConfig from '../config/colorConfig';
import AwesomeAlert from 'react-native-awesome-alerts';

export class ErrorUtils {
  constructor(error, title = "") {
    this.state = { showAlert: true };
    this.errorTitle = title;
    this.errorText = "Something went wrong";
    if (error.message) {
      this.errorText = error.message
    } else if (error.responseBody && error.responseBody.message) {
      this.errorText = error.responseBody.message;
    } else if (error.responseBody) {
      this.errorText = error.responseBody;
    }
  }

  hideAlert = () => {
    this.setState({
      showAlert: false
    });
  };

  showAlert() {
    return <AwesomeAlert
      show={showAlert}
      showProgress={false}
      title={this.errorTitle}
      message={this.errorText}
      closeOnTouchOutside={true}
      closeOnHardwareBackPress={false}
      showCancelButton={true}
      showConfirmButton={true}
      cancelText="No, cancel"
      confirmText="Yes, delete it"
      confirmButtonColor={colorConfig.pageIndex.activeTintColor}
      onCancelPressed={() => {
        this.hideAlert();
      }}
      onConfirmPressed={() => {
        this.hideAlert();
      }}
    />
  }
}
