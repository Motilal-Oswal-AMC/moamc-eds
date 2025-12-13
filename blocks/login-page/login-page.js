import {
  div, p, input, label, span, img,
} from '../../scripts/dom-helpers.js';
import dataMapMoObj from '../../scripts/constant.js';
import { myAPI } from '../../scripts/scripts.js';

export default function decorate(block) {
  const loginImagev2 = block.closest('.login-page-container');
  const logImgeV1 = loginImagev2.querySelector('.login-image-item-wrapper');
  const loginImage = loginImagev2.querySelector('.login-page-wrapper');
  dataMapMoObj.CLASS_PREFIXES = [
    'login-item',
    'login-sub-item',
    'login-inner-item',
  ];
  dataMapMoObj.addIndexed(block);

  dataMapMoObj.CLASS_PREFIXES = [
    'login-image-item',
    'login-image-sub-item',
    'login-image-inner-item',
  ];
  dataMapMoObj.addIndexed(logImgeV1);

  const loginPagePan = div(
    { class: 'main-login-page' },
    div(
      { class: 'login-pan-label' },
      p({ class: 'user-pan-para' }, 'Let’s Get Started'),
      div(
        { class: 'user-input-error' },
        label({ class: 'input-lable' }, 'Enter PAN'),
        input({ class: 'user-input', placeholder: 'Enter Pan' }),
        p({ class: 'error-login' }, 'Please enter a valid PAN'),
      ),
    ),

    div({ class: 'response-block' }),

    div(
      { class: 'btn-descr' },
      p({ class: 'auth btn' }, 'Authenticate'),
      div(
        { class: 'discr-new-invester' },
        p(
          { class: 'discr' },
          'By clicking ‘Continue’, you accept the',
          span({ class: 'terms-disc' }, 'Terms and conditions'),
          'of Motilal Oswal AMC and agree to receive alerts & notifications via Motilal Oswal AMC SMS, Email and Business Whatsapp Account services.',
        ),
        p(
          { class: 'new-invest' },
          'Don’t have an account ?',
          span({ class: 'new-invest-disc' }, 'New Investor'),
        ),
      ),
    ),
  );

  const userLoginPage = loginImage;
  // document.querySelector('.login-page-wrapper');

  userLoginPage.innerHTML = '';

  // block when need to form

  userLoginPage.append(loginPagePan);

  const kycVerified = div(
    { class: 'kycblock', style: 'display:block' },

    div(
      { class: 'enter-input-block' },
      label({ class: 'enter-label' }, 'Enter OTP'),
      div(
        { class: 'input-resend' },
        div(
          { class: 'otp-inputs-block' },
          input({ class: 'otp-input otp-input-succ' }),
          input({ class: 'otp-input otp-input-error' }),
          input({ class: 'otp-input otp-input-error' }),
          input({ class: 'otp-input otp-input-error' }),
          input({ class: 'otp-input otp-input-error' }),
          input({ class: 'otp-input otp-input-error' }),
        ),
        p({ class: 'resend' }, 'Resend OTP'),
      ),
      p({ class: 'incorrect-otp' }, 'Incorrect OTP'),
    ),

    div(
      { class: 'otp-para-block' },
      p(
        { class: 'otp-para' },
        'An OTP has been sent to siddharthXXXXX@gmail.com and mobile number 98XXX XXX65. SMS delivery may be delayed—please check your email for the OTP.',
      ),
    ),
  );

  const kycVerifiedAdd = loginImage.querySelector('.response-block');

  // block when need to response kyc succssess
  kycVerifiedAdd.append(kycVerified);

  const twoFactor = div(
    { class: 'passcode-main', style: 'display:none' },
    div(
      { class: 'label-pass' },
      label({ class: 'passcode-label' }, 'Enter Passcode'),
      div(
        { class: 'pass-input' },
        input({ class: 'pass-code-input error-pass', type: 'password' }),
        input({ class: 'pass-code-input error-pass', type: 'password' }),
        input({ class: 'pass-code-input error-pass', type: 'password' }),
        input({ class: 'pass-code-input succ-pass', type: 'password' }),
      ),
      p({ class: 'error-para' }, 'Incorrect Passcode'),
    ),
    p({ class: 'forget-pass' }, p({ class: 'pass-para' }, 'Forget Passcode?')),
  );

  // block when need to use Two Factor Authentication

  kycVerifiedAdd.append(twoFactor);

  const kycRegistered = div(
    { class: 'main-register', style: 'display:block' },
    div(
      { class: 'text-status-block' },
      div(
        { class: 'radio-text' },
        p({ class: 'radio-text' }, 'Tax Status'),
        div(
          { class: 'text-radio-input' },
          div(
            { class: 'radio-label-input' },
            input({ class: 'radio-input', type: 'radio' }),
            label({ class: 'radio-label' }, 'Indian'),
          ),

          div(
            { class: 'radio-label-input' },
            input({ class: 'radio-input', type: 'radio' }),
            label({ class: 'radio-label' }, 'NRI'),
          ),
        ),
      ),

      div(
        { class: 'disc-text' },
        p({ class: 'text-registered' }, 'Your KYC is registered'),
        p(
          { class: 'disc-text-all' },
          'According to regulatory updates, KYC-registered investors must now submit Aadhaar-based KYC documents for investment transactions.',
        ),
      ),
    ),

    div(
      { class: 'register-input-block' },
      div(
        { class: 'name-number-input' },
        div(
          { class: 'register-name-input  cont block-label-input' },
          label({ class: 'register-user-label label-reg ' }, 'Name as on PAN'),
          input({ class: 'register-user-input input-reg' }),
        ),

        div(
          { class: 'reg-mob-con-code' },
          div(
            { class: 'cont-code-block cont block-label-input cont-code' },
            p({ class: 'contry-code-para' }, '+91'),
            // input({ class: 'contry-code input-reg' }),
          ),
          div(
            { class: 'cont-code-block block-label-input' },
            label({ class: 'phone-number-label label-reg' }, 'Mobile Number'),
            input({ class: 'phone-number-input input-reg' }),
          ),
        ),
      ),

      div(
        { class: 'email-cty-name' },
        div(
          { class: 'email-block block-rex' },
          label({ class: 'label-email label-rex' }, 'Email ID'),
          input({ class: 'email-input input-rex' }),
        ),
        div(
          { class: 'city-block block-rex' },
          label({ class: 'label-city label-rex' }, 'City Name'),
          input({ class: 'city-input input-rex' }),
        ),
      ),
    ),
  );

  // kycRegistered  for Registered UI
  kycVerifiedAdd.append(kycRegistered);

  // Api Calls
  dataMapMoObj.panDlts = {};
  const paninput = userLoginPage.querySelector('.user-input');
  paninput.setAttribute('maxLength', 10);
  const errorPanEl = paninput.nextSibling;
  const btnAuthenticate = userLoginPage.querySelector('.btn-descr .auth');
  errorPanEl.style.display = 'none';
  let pansuccessForm;
  let inputs;
  let parentDiv;
  function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    const expires = `expires=${d.toUTCString()}`;
    document.cookie = `${cname}=${cvalue};${expires};path=/`;
  }
  async function getCkycData(paramDtArg) {
    try {
      const reqGetckyc = {
        panNo: paramDtArg,
      };
      const rejsin = await myAPI(
        'POST',
        'https://api.moamc.com/prelogin/api/KYC/GetKYCData',
        reqGetckyc,
      );
      if (rejsin.data !== null) {
        // username
        parentDiv.querySelector('.register-user-input').value = rejsin.data.investorName;
        parentDiv
          .querySelector('.register-user-input')
          .setAttribute('readonly', '');
        // phonenumber
        parentDiv.querySelector('.phone-number-input').value = rejsin.data.mobileNo;
        parentDiv
          .querySelector('.phone-number-input')
          .setAttribute('readonly', '');
        // email
        parentDiv.querySelector('.email-input').value = rejsin.data.email;
        parentDiv.querySelector('.email-input').setAttribute('readonly', '');
      }
    } catch (error) {
      // console.log(error);
    }
  }
  async function panDetails(params) {
    try {
      const request = {
        name: params.userLogPanNm,
        panNo: params.userLogPan,
        otp: 0,
        saveForLater: true,
      };
      const rejsin = await myAPI(
        'POST',
        'https://api.moamc.com/MFTransaction/api/InvestorDetails/panDetail',
        request,
      );
      const guestFlag = dataMapMoObj.panDlts.isGuest;
      // localStorage.getItem('isGuest');
      if (guestFlag === 'true') {
        setCookie('accessToken', rejsin.data.accessToken);
        setCookie('refreshToken', rejsin.data.refreshToken);
        window.location.href = 'https://mf.moamc.com/mutualfund/onboarding/personal';
      } else if (guestFlag === 'false') {
        const locobj = {
          panNo: params.userLogPan,
          panName: params.userLogPanNm,
          mobileNo: params.userLogMoNm,
          emailId: params.userLogEm,
        };
        localStorage.setItem('signzy', JSON.stringify(locobj));
        window.location.href = 'https://mf.moamc.com/mutualfund/prelogin-to-postlogin-connector';
      }
    } catch (error) {
      // console.log(error);
    }
  }

  async function lmsentCall(paramData) {
    try {
      const request = {
        frmdata: `LMS~${paramData.userLogPan}|${paramData.userLogPanNm}|+91${paramData.userLogMoNm}|${paramData.userLogEm}||Mumbai||${paramData.kycflag}|MF New investor|||||||||${paramData.isnri}|`,
      };
      const setRep = await myAPI(
        'POST',
        'https://api.moamc.com/initapi/api/Init/Lmsentry',
        request,
      );
      console.log(setRep);
      panDetails(paramData);
    } catch (error) {
      // console.log(error);
    }
  }

  async function modiFyKycApicall(param) {
    try {
      const request = {
        name: param.userLogPanNm,
        email: param.userLogEm,
        phone: param.userLogMoNm,
        returnUrl: 'https://mf.moamc.com/onboarding/personal',
        timeOutUrl: 'https://mf.moamc.com/error',
        panNo: param.userLogPan,
      };
      const rejsin = await myAPI(
        'POST',
        'https://api.moamc.com/prelogin/api/KYC/KYCProcess',
        request,
      );
      console.log('this is modiFuykyc Api Response ', rejsin);
      lmsentCall(param);
    } catch (error) {
      // console.log(error);
    }
  }
  async function apiPasscode(params) {
    try {
      const reqAuth = {
        password: params.optNo,
        userId: params.panNo,
        loginModeId: 1,
        credentialModeId: 3,
        ipV4: '192.198.22.22',
        otpThroughDIT: false,
        ditotpType: '',
        pmsGuest: false,
        isAIF: false,
        mfGuest: false,
        product: 'MF',
      };

      const header = {
        'Content-Type': 'application/json',
        'User-Agent': 'WEB/MultipleCampaign',
        'user-agent': 'WEB/MultipleCampaign',
        UserAgent: 'WEB/MultipleCampaign',
      };
      const rejsin = await myAPI(
        'POST',
        'https://api.moamc.com/loginapi/api/Login/AuthenticateUserCred',
        reqAuth,
        header,
      );
      if (rejsin.data && rejsin.data.userInfo) {
        document.cookie = `accessToken= ${rejsin.data.accessToken}`;
        document.cookie = `refreshToken= ${rejsin.data.refreshToken}`;
        localStorage.setItem('userObj', JSON.stringify(rejsin.data.userInfo));
        if (dataMapMoObj.panRes.data.guestClient !== '') {
          // window.location.href = 'https://mf.moamc.com/mutualfund/onboarding/personal';
        } else if (dataMapMoObj.panRes.data.guestClient === '') {
          // window.location.href = 'https://mf.moamc.com/mutualfund/prelogin-to-postlogin-connector';
        }
      }
    } catch (error) {
      // console.log(error);
    }
  }

  async function apiAuth(params) {
    try {
      const reqAuth = {
        password: params.optNo,
        userId: params.panNo,
        loginModeId: 1,
        credentialModeId: 1,
        ipV4: '192.198.22.22',
        otpThroughDIT: false,
        ditotpType: '',
        pmsGuest: false,
        isAIF: false,
        mfGuest: false,
        product: 'MF',
      };
      const header = {
        'Content-Type': 'application/json',
        'User-Agent': 'WEB/MultipleCampaign',
        'user-agent': 'WEB/MultipleCampaign',
        UserAgent: 'WEB/MultipleCampaign',
      };
      const rejsin = await myAPI(
        'POST',
        'https://api.moamc.com/loginapi/api/Login/AuthenticateUserCred',
        reqAuth,
        header,
      );
      console.log(rejsin);
      // if (rejsin.data.userInfo) {
      //   document.cookie = `accessToken= ${rejsin.data.accessToken}`;
      //   document.cookie = `refreshToken= ${rejsin.data.refreshToken}`;
      //   localStorage.setItem('userObj', JSON.stringify(rejsin.data.userInfo));
      //   if (dataMapMoObj.panRes.data.guestClient !== '') {
      //     window.location.href = 'https://mf.moamc.com/mutualfund/onboarding/personal';
      //   } else if (dataMapMoObj.panRes.data.guestClient === '') {
      //     window.location.href = 'https://mf.moamc.com/mutualfund/prelogin-to-postlogin-connector';
      //   }
      // }
      // console.log(rejsin);

      kycVerifiedAdd.append(twoFactor);
      const passcodeScreen = parentDiv.querySelector('.passcode-main');
      const blockTitle = parentDiv.querySelector('.user-pan-para');
      blockTitle.textContent = '';
      blockTitle.textContent = 'Two Factor Authentication';
      parentDiv.querySelector('.kycblock').style.display = 'none';
      parentDiv.querySelector('.user-input-error').style.display = 'none';
      passcodeScreen.style.display = 'block';
      btnAuthenticate.textContent = '';
      btnAuthenticate.textContent = 'Continue';
      const factinputs = passcodeScreen.querySelectorAll('input');
      factinputs.forEach((inputelfac, index) => {
        inputelfac.setAttribute('maxLength', 1);
        inputelfac.addEventListener('input', () => {
          inputelfac.value = inputelfac.value.replace(/[^0-9]/g, '');
          if (inputelfac.value.length === 1 && index < factinputs.length - 1) {
            factinputs[index + 1].focus();
          }
        });
        inputelfac.addEventListener('keydown', (event) => {
          const totalInputs = factinputs.length;
          if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            event.preventDefault();
          }
          switch (event.key) {
            case 'Tab':
              if (!event.shiftKey && index === totalInputs - 1) {
                event.preventDefault();
                factinputs[0].focus();
              } else if (event.shiftKey && index === 0) {
                event.preventDefault();
                factinputs[totalInputs - 1].focus();
              }
              break;

            case 'ArrowRight': {
              const nextIndex = (index + 1) % totalInputs;
              factinputs[nextIndex].focus();
              break;
            }
            case 'ArrowLeft': {
              // Move to the previous input, or wrap to the last
              const prevIndex = (index - 1 + totalInputs) % totalInputs;
              factinputs[prevIndex].focus();
              break;
            }
            case 'Backspace':
              if (inputelfac.value.length === 0 && index > 0) {
                factinputs[index - 1].focus();
              }
              break;
            default:
              break;
          }
        });
      });
      // params.otpField.classList.add('otp-succes');
    } catch (error) {
      // console.log(error);
    }
  }
  async function otpCall(param) {
    try {
      const request = {
        userId: param,
        loginModeId: 1,
        credentialModeId: 1,
        ipV4: '192.168.22.22',
        otpThroughDIT: false,
        ditotpType: '',
        pmsGuest: false,
        isAIF: false,
        mfGuest: false,
        product: 'MF',
      };

      const header = {
        'Content-Type': 'application/json',
        'User-Agent': 'WEB/MultipleCampaign',
        'user-agent': 'WEB/MultipleCampaign',
        UserAgent: 'WEB/MultipleCampaign',
      };
      const rejsin = await myAPI(
        'POST',
        'https://api.moamc.com/LoginAPI/api/Login/GenerateOtpNew',
        request,
        header,
      );
      if (rejsin.data !== null) {
        const subtext = pansuccessForm;
        subtext.textContent = '';
        subtext.textContent = rejsin.data;
      } else if (rejsin.message.toLocaleLowerCase() !== 'successful') {
        const subtext = pansuccessForm;
        subtext.textContent = '';
        subtext.textContent = rejsin.message;
      }
    } catch (error) {
      // console.log(error);
    }
  }
  async function kycCall(param) {
    try {
      const request = {
        panNo: param,
      };
      const rejsin = await myAPI(
        'POST',
        ' https://api.moamc.com/InitAPI/api/Init/CVLKYCCheck',
        request,
      );
      const kycres = rejsin.data.kycStatus;
      const kycName = rejsin.data.nameAsOnPan;
      const isKyc = dataMapMoObj.panRes.data.existingClient;
      dataMapMoObj.kycStatus = rejsin.data.kycStatus;
      const boolkyc = kycres === 'Y' ? 'true' : 'false';
      localStorage.setItem('kycstatus', boolkyc);

      const KRA_VERIFIED = ['002', '102', '202', '302', '402', '502'];
      const KRA_VALIDATED = [
        '007',
        '107',
        '207',
        '307',
        '407',
        '507',
        '011',
        '111',
        '211',
        '311',
        '411',
        '511',
        '012',
        '112',
        '212',
        '312',
        '412',
        '512',
      ];
      if (KRA_VERIFIED.includes(rejsin.data.cvlAppStatus)) {
        localStorage.setItem('kraVerified', 'Y');
      }

      if (KRA_VALIDATED.includes(rejsin.data.cvlAppStatus)) {
        localStorage.setItem('kraValidated', 'Y');
      }

      btnAuthenticate.textContent = '';
      btnAuthenticate.textContent = 'Submit';

      if (isKyc !== '') {
        kycVerifiedAdd.append(kycVerified);
        pansuccessForm = kycVerifiedAdd.querySelector('.otp-para');
        const paraSucc = div(
          { class: 'para-succ' },
          img({ class: 'succ-img' }),
          p({ class: 'succ-para' }, 'Awesome. You are KYC verified!'),
        );
        const inpPara = document.querySelector('.user-input-error');
        inpPara.appendChild(paraSucc);
        const blockTitle = parentDiv.querySelector('.user-pan-para');
        blockTitle.textContent = '';
        blockTitle.textContent = `Welcome ${dataMapMoObj.toTitleCase(kycName)}`;
        inputs = kycVerifiedAdd.querySelectorAll('.input-resend input');
        inputs.forEach((inputel, index) => {
          inputel.setAttribute('maxLength', 1);
          inputel.addEventListener('input', () => {
            inputel.value = inputel.value.replace(/[^0-9]/g, '');
            if (inputel.value.length === 1 && index < inputs.length - 1) {
              inputs[index + 1].focus();
            }
          });
          inputel.addEventListener('keydown', (event) => {
            const totalInputs = inputs.length;
            if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
              event.preventDefault();
            }
            switch (event.key) {
              case 'Tab':
                if (!event.shiftKey && index === totalInputs - 1) {
                  event.preventDefault();
                  inputs[0].focus();
                } else if (event.shiftKey && index === 0) {
                  event.preventDefault();
                  inputs[totalInputs - 1].focus();
                }
                break;

              case 'ArrowRight': {
                const nextIndex = (index + 1) % totalInputs;
                inputs[nextIndex].focus();
                break;
              }
              case 'ArrowLeft': {
                // Move to the previous input, or wrap to the last
                const prevIndex = (index - 1 + totalInputs) % totalInputs;
                inputs[prevIndex].focus();
                break;
              }
              case 'Backspace':
                if (inputel.value.length === 0 && index > 0) {
                  inputs[index - 1].focus();
                }
                break;
              default:
                break;
            }
          });
        });
        kycVerifiedAdd
          .querySelector('.resend')
          .addEventListener('click', () => {
            dataMapMoObj.otpLimit += 1;
            if (dataMapMoObj.otpLimit <= 5) {
              otpCall(param);
            }
          });

        otpCall(param);
        dataMapMoObj.otpLimit = 1;
      } else {
        kycVerifiedAdd.append(kycRegistered);

        const pagecontain = parentDiv.closest('.login-page-container');
        pagecontain.classList.add('login-register');

        const blockTitle = parentDiv.querySelector('.user-pan-para');
        blockTitle.textContent = '';
        blockTitle.textContent = 'Welcome Aboard!';
        const userLoginPanNumber = parentDiv.querySelector('.user-input');
        userLoginPanNumber.setAttribute('readonly', true);
        const userNm = parentDiv.querySelector('.register-user-input');
        const userNo = parentDiv.querySelector('.phone-number-input');
        const userem = parentDiv.querySelector('.email-input');
        parentDiv.querySelectorAll('.radio-input')[0].click();
        // const editInput = closestParam.querySelector('.pan-image');
        // userLoginPanNumber.setAttribute('maxLength', 10);
        userNo.setAttribute('maxLength', 10);
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        const phoneRegex = /^\d{10}$/;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const usernameRegex = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;

        userNm.addEventListener('input', (e) => {
          const inputValue = e.target.value.toUpperCase();
          // const errorpan = e.target.parentElement;
          // const errorPanEl = errorpan.nextElementSibling;
          if (usernameRegex.test(inputValue)) {
            // errorPanEl.classList.add('hide-error');
            // errorPanEl.classList.remove('show-error');
            userLoginPanNumber.setAttribute('readonly', true);
            if (
              panRegex.test(userLoginPanNumber.value)
              && phoneRegex.test(userNo.value)
              && emailRegex.test(userem.value)
              && usernameRegex.test(userNm.value)
            ) {
              btnAuthenticate.style.pointerEvents = '';
            }
          } else {
            btnAuthenticate.style.pointerEvents = 'none';
            // errorPanEl.classList.remove('hide-error');
            // errorPanEl.classList.add('show-error');
            // continueBTN.classList.remove('active-form-btn');
          }
        });
        userNo.addEventListener('input', (e) => {
          const inputValue = e.target.value.toUpperCase();
          // const errorpan = e.target.parentElement;
          // const errorPanEl = errorpan.nextElementSibling;
          if (phoneRegex.test(inputValue)) {
            // errorPanEl.classList.remove('show-error');
            // errorPanEl.classList.add('hide-error');
            userLoginPanNumber.setAttribute('readonly', true);
            if (
              panRegex.test(userLoginPanNumber.value)
              && phoneRegex.test(userNo.value)
              && emailRegex.test(userem.value)
              && usernameRegex.test(userNm.value)
            ) {
              btnAuthenticate.style.pointerEvents = '';
            }
          } else {
            // errorPanEl.classList.remove('hide-error');
            // errorPanEl.classList.add('show-error');
            btnAuthenticate.style.pointerEvents = 'none';
          }
        });
        userem.addEventListener('input', (e) => {
          const inputValue = e.target.value.toUpperCase();
          // const errorpan = e.target.parentElement;
          // const errorPanEl = errorpan.nextElementSibling;
          if (emailRegex.test(inputValue)) {
            // errorPanEl.classList.remove('show-error');
            // errorPanEl.classList.add('hide-error');
            userLoginPanNumber.setAttribute('readonly', true);
            if (
              panRegex.test(userLoginPanNumber.value)
              && phoneRegex.test(userNo.value)
              && emailRegex.test(userem.value)
              && usernameRegex.test(userNm.value)
            ) {
              btnAuthenticate.style.pointerEvents = '';
            }
          } else {
            // errorPanEl.classList.remove('hide-error');
            // errorPanEl.classList.add('show-error');
            btnAuthenticate.style.pointerEvents = 'none';
          }
        });
        const cityName = parentDiv.querySelector('.city-input');
        if (cityName.value.length > 2) {
          btnAuthenticate.style.pointerEvents = '';
        } else {
          btnAuthenticate.style.pointerEvents = 'none';
        }
        if (boolkyc === 'true') {
          const pandata = {
            userLogPanNm: userLoginPanNumber.value,
            userLogPan: rejsin.data.nameAsOnPan,
          };
          panDetails(pandata);
        } else {
          getCkycData(userLoginPanNumber.value);
        }
      }
    } catch (error) {
      // console.log(error);
    }
  }
  async function apiCall(userPanNumber) {
    try {
      dataMapMoObj.panDlts.isIndividualPan = userPanNumber;
      dataMapMoObj.panDlts.pannumber = userPanNumber;
      const request = {
        panNo: userPanNumber,
      };
      const rejsin = await myAPI(
        'POST',
        'https://api.moamc.com/LoginAPI/api/Login/GetClientType',
        request,
      );
      dataMapMoObj.panRes = rejsin;

      // const isSuccess = rejsin.data.existingClient === '' ? false : true;
      const tempArray = ['MF', 'BOTH'];
      const exixting = ['ZBF', 'REDEEMZBF'];
      if (rejsin.data.guestClient === '') {
        dataMapMoObj.panDlts.isNewGuest = true;
      } else if (tempArray.includes(rejsin.data.guestClient)) {
        dataMapMoObj.panDlts.isGuest = true;
        dataMapMoObj.panDlts.guestMenuState = {
          guestMenu: true,
          existingBox: false,
        };
      } else if (exixting.includes(rejsin.data.existingClient)) {
        dataMapMoObj.panDlts.isGuest = false;
        dataMapMoObj.panDlts.guestMenuState = {
          guestMenu: true,
          existingBox: false,
        };
      } else if (tempArray.includes(rejsin.data.newClient)) {
        dataMapMoObj.panDlts.isGuest = false;
        dataMapMoObj.panDlts.guestMenuState = {
          guestMenu: true,
          existingBox: false,
        };
      }

      localStorage.setItem(
        'UPDATE_GUEST_MENU',
        JSON.stringify(dataMapMoObj.panDlts.guestMenuState),
      );
      localStorage.setItem('isGuest', dataMapMoObj.panDlts.isGuest);

      kycCall(userPanNumber);
    } catch (error) {
      // console.log(error);
    }
  }
  // Functionality
  paninput.addEventListener('input', (e) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const inputValue = e.target.value.toUpperCase();

    if (inputValue.length < 1) {
      // If empty, hide the error
      errorPanEl.style.display = 'none';
      btnAuthenticate.style.pointerEvents = 'none';
    } else if (panRegex.test(inputValue)) {
      // If valid PAN, hide error
      errorPanEl.style.display = 'none';
      btnAuthenticate.style.pointerEvents = '';
    } else {
      // If invalid PAN, show error
      errorPanEl.style.display = 'block';
      btnAuthenticate.style.pointerEvents = 'none';
    }
  });

  btnAuthenticate.addEventListener('click', (e) => {
    e.preventDefault();
    parentDiv = e.target.closest('.main-login-page');
    const otpscreen = parentDiv.querySelector('.kycblock');
    const twofactor = parentDiv.querySelector('.passcode-main');
    const registerScreen = parentDiv.querySelector('.main-register');
    const panval = paninput.value;
    if (
      otpscreen
      && otpscreen.style.display !== ''
      && otpscreen.style.display !== 'none'
    ) {
      const inotp = inputs;
      let optValue = '';
      inotp.forEach((elfor) => {
        optValue += elfor.value;
      });
      if (optValue.length < 6) {
        // pansuccessForm.querySelector('.otpfield').classList.add('otp-failed');
      } else {
        const panNum = {
          panNo: panval,
          optNo: optValue,
          otpField: pansuccessForm,
        };
        apiAuth(panNum);
      }
    } else if (
      twofactor
      && twofactor.style.display !== ''
      && twofactor.style.display !== 'none'
    ) {
      const passpoint = twofactor.querySelectorAll('input');
      let passValue = '';
      passpoint.forEach((elfor) => {
        passValue += elfor.value;
      });
      if (passValue.length < 4) {
        // pansuccessForm.querySelector('.otpfield').classList.add('otp-failed');
      } else {
        const panNum = {
          panNo: panval,
          optNo: passValue,
          otpField: pansuccessForm,
        };
        apiPasscode(panNum);
      }
    } else if (
      registerScreen
      && registerScreen.style.display !== ''
      && registerScreen.style.display !== 'none'
    ) {
      // console.log('Register Form');
      const userLoginPanNumber = parentDiv.querySelector('.user-input').value; // input
      const isNri = parentDiv.querySelectorAll('.radio-input')[1].checked;
      const userLoginPanName = parentDiv.querySelector(
        '.register-user-input',
      ).value;
      const userLoginMobileNumber = parentDiv.querySelector(
        '.phone-number-input',
      ).value;
      const userLoginEmail = parentDiv.querySelector('.email-input').value;
      const userCity = parentDiv.querySelector('.city-input').value;
      const formdata = {
        userLogPan: userLoginPanNumber,
        userLogPanNm: userLoginPanName,
        userLogMoNm: userLoginMobileNumber,
        userLogEm: userLoginEmail,
        isnri: isNri,
        kycflag: dataMapMoObj.kycStatus,
        usercity: userCity,
      };
      modiFyKycApicall(formdata);
    } else if (errorPanEl.style.display === 'none' && panval.length === 10) {
      apiCall(panval);
    }
  });
}
