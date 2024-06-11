import { Button } from '@eigakan/components/Button';
import { CRUD } from '@eigakan/components/CRUD';
import { Input } from '@eigakan/components/Input';
import { useCRUD } from '@eigakan/hooks/useCRUD';
import { client } from '@eigakan/trpc/client';
import { validation } from '@eigakan/validation';
import Image from 'next/image';
import { useState } from 'react';
import { TMDB } from 'tmdb-ts';

const tmdb = new TMDB(
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ZmU4MTZhOTUwMGEzNzZjZTQ4MDA1MjE1ODNhZDViNyIsInN1YiI6IjU5ODcwMWI1YzNhMzY4Mzc1ZjAwY2U2MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.eD86wBxafAhSqsnS1HZhoYtw9gUMmELMyi4gNmbetQs',
);

const Movies = () => {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [posters, setPosters] = useState<string[]>([]);
  const [prevQuery, setPrevQuery] = useState('');
  const [results, setResults] = useState<{ id: number; poster: string; title: string }[]>([]);

  const [id, setId] = useState(0);
  const [poster, setPoster] = useState('');
  const [title, setTitle] = useState('');

  const { props, validator } = useCRUD({
    input: { id, poster, title },
    isEqual: ({ data, input }) => data.some(existing => input.poster === existing.poster && input.title === existing.title),
    mutations: client.admin.mutations.movie,
    onDelete: () => id,
    onInsertClick: () => {
      setId(0);
      setPoster('');
      setTitle('');
    },
    onSuccess: utils => utils.admin.queries.movies.invalidate(),
    query: client.admin.queries.movies,
    validator: validation.movie,
  });

  const handleClick = (result: (typeof results)[0]) => {
    setId(result.id);
    setPoster(result.poster);
    setTitle(result.title);
  };

  const handlePosterSearch = async () => {
    setLoading(true);

    try {
      setPosters((await tmdb.movies.images(id, { include_image_language: ['ja'] })).posters.map(({ file_path }) => file_path));
    } finally {
      setLoading(false);
    }
  };

  const handleMovieSearch = async () => {
    setLoading(true);

    try {
      setResults(
        (await tmdb.search.movies({ language: 'ja-JP', query })).results.map(({ poster_path, ...result }) => ({
          id: result.id,
          poster: poster_path,
          title: result.title,
        })),
      );
    } finally {
      setLoading(false);
      setPrevQuery(query);
    }
  };

  return (
    <CRUD
      {...props}
      rows={({ DeleteButton, EditButton, data: movies }) =>
        movies?.map(movie => (
          <>
            <div className="flex w-full items-center gap-x-2">
              <Image alt="" className="object-cover" height={138} src={`https://image.tmdb.org/t/p/w154${movie.poster}`} width={92} />
              <p className="w-full">{movie.title}</p>
            </div>

            <div className="flex w-24 shrink-0 gap-x-2">
              <EditButton
                onClick={() => {
                  setId(movie.id);
                  setPoster(movie.poster);
                  setTitle(movie.title);
                  handlePosterSearch();
                }}
              />

              <DeleteButton disabled={movie._count.titles > 0} label={movie.title} onClick={() => setId(movie.id)} />
            </div>
          </>
        ))
      }
      title="映画"
    >
      {props.isUpdating ? (
        <div className="grid h-44 grid-cols-4 overflow-y-scroll rounded-md border border-zinc-200 bg-white shadow-inner">
          {posters.length === 0 ? (
            <p>TODO</p>
          ) : (
            posters.map(src => (
              <button key={src} onClick={() => setPoster(src)}>
                <Image alt="" height={138} src={`https://image.tmdb.org/t/p/w154${src}`} width={92} />
              </button>
            ))
          )}
        </div>
      ) : (
        <>
          <Input
            autoFocus
            label="タイトル検索"
            loading={props.loading}
            onChange={setQuery}
            onEnter={handleMovieSearch}
            placeholder="オッペンハイマー"
            validator={validator.shape.title}
            value={query}
          />

          <div className="flex h-44 flex-col items-center justify-center overflow-y-scroll rounded-md border border-zinc-200 bg-white shadow-inner">
            {results.length === 0 ? (
              <p>TODO</p>
            ) : (
              results.map(result => (
                <button className="flex w-full items-center gap-x-2" key={result.title} onClick={() => handleClick(result)}>
                  <Image alt="" height={138} src={`https://image.tmdb.org/t/p/w154${result.poster}`} width={92} />
                  <p className="w-full font-semibold">{result.title}</p>
                </button>
              ))
            )}
          </div>

          <Button disabled={query.length === 0 || query === prevQuery} loading={loading} onClick={handleMovieSearch}>
            検索する
          </Button>
        </>
      )}
    </CRUD>
  );
};

export default Movies;
