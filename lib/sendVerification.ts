import { prisma } from '@eigakan/db';

const sendVerification = (email: string) => {
  // const code = `${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(
  //   Math.random() * 10,
  // )}`;

  const code = '0000';

  return prisma.$transaction(async transaction => {
    await transaction.emailVerification.upsert({
      create: {
        code,
        email,
      },
      update: {
        code,
        email,
      },
      where: {
        email,
      },
    });

    // TODO: メールを送信
  });
};

export { sendVerification };
