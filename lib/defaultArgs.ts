const defaultArgs = {
  orderBy: {
    showtimes: {
      _count: 'desc' as const,
    },
  },
  where: {
    showtimes: {
      some: {
        start: {
          gt: new Date(),
        },
      },
    },
  },
};

export { defaultArgs };
