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
          gte: new Date(),
        },
      },
    },
  },
};

export { defaultArgs };
