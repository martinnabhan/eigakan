import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

const useReCaptchaToken = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const getReCaptchaToken = async () => {
    let reCaptchaToken;

    if (process.env.NEXT_PUBLIC_RECAPTCHA_KEY) {
      if (!executeRecaptcha) {
        throw new Error('reCAPTCHA を実行できませんでした。');
      }

      reCaptchaToken = await executeRecaptcha();
    }

    return reCaptchaToken;
  };

  return {
    getReCaptchaToken,
  };
};

export { useReCaptchaToken };
