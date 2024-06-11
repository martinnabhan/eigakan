import { CRUD } from '@eigakan/components/CRUD';
import { Input } from '@eigakan/components/Input';
import { Select } from '@eigakan/components/Select';
import { useCRUD } from '@eigakan/hooks/useCRUD';
import { useQuery } from '@eigakan/hooks/useQuery';
import { client } from '@eigakan/trpc/client';
import { validation } from '@eigakan/validation';
import { useState } from 'react';

const MovieTitles = () => {
  const [movieId, setMovieId] = useState<number | null>(null);
  const [title, setTitle] = useState('');

  const { data: movies } = useQuery(client.admin.queries.movies);

  const { props } = useCRUD({
    input: { movieId, title },
    isEqual: ({ data, input }) => data.some(existing => input.movieId === existing.movie?.id && input.title === existing.title),
    mutations: client.admin.mutations.movieTitle,
    onDelete: () => title,
    onSuccess: utils => utils.admin.queries.movieTitles.invalidate(),
    query: client.admin.queries.movieTitles,
    validator: validation.movieTitle,
  });

  return (
    <CRUD
      {...props}
      columns={
        <>
          <p className="w-full">タイトル</p>
          <p className="w-full">映画</p>
          <p className="w-24 shrink-0" />
        </>
      }
      rows={({ DeleteButton, EditButton, data: movieTitles }) =>
        movieTitles?.map(movieTitle => (
          <>
            <p className="w-full">{movieTitle.title}</p>

            <p className="w-full">{movieTitle.movie ? movieTitle.movie.title : '未登録'}</p>

            <div className="flex w-24 shrink-0 gap-x-2">
              <EditButton
                onClick={() => {
                  setMovieId(movieTitle.movie?.id || null);
                  setTitle(movieTitle.title);
                }}
              />
              <DeleteButton disabled={false} label={movieTitle.title} onClick={() => setTitle(movieTitle.title)} />
            </div>
          </>
        ))
      }
      title="映画館名"
    >
      <Input disabled label="タイトル" value={title} />

      <Select
        autoFocus
        label="映画"
        loading={props.loading}
        onChange={value => setMovieId(value ? Number(value) : null)}
        options={[
          { label: '未登録', value: '' },
          ...(movies ? movies.map(movie => ({ label: movie.title, value: movie.id.toString() })) : []),
        ]}
        value={movieId ? movieId.toString() : ''}
      />
    </CRUD>
  );
};

export default MovieTitles;
