const checkReCaptchaToken = async (reCaptchaToken: string | undefined) => {
  if (process.env.RECAPTCHA_SECRET_KEY) {
    if (!reCaptchaToken) {
      throw new Error('reCAPTCHAトークンが無効です。');
    }

    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      body: `response=${reCaptchaToken}&secret=${process.env.RECAPTCHA_SECRET_KEY}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('reCAPTCHAトークンを確認できませんでした。');
    }

    const { success } = (await response.json()) as { success: boolean };

    if (!success) {
      throw new Error('reCAPTCHAトークンが無効です。');
    }
  }
};

export { checkReCaptchaToken };
