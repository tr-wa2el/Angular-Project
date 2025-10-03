export interface ApiEndpoint {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  mockData: any;
}

export const ApiNodes = {
  // Movies endpoints
  getPopularMovies: {
    url: '/movie/popular',
    method: 'GET' as const,
    mockData: {
      page: 1,
      results: [
        {
          id: 550,
          title: "Fight Club",
          original_title: "Fight Club",
          overview: "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.",
          poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
          backdrop_path: "/hZkgoQYus5vegHoetLkCJzb17zJ.jpg",
          release_date: "1999-10-15",
          genre_ids: [18, 53, 35],
          vote_average: 8.433,
          vote_count: 26280,
          adult: false,
          video: false,
          popularity: 61.416
        },
        {
          id: 155,
          title: "The Dark Knight",
          original_title: "The Dark Knight",
          overview: "Batman raises the stakes in his war on crime with the help of Lt. Jim Gordon and DA Harvey Dent.",
          poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
          backdrop_path: "/qlGoGQSVMzIjGbpvXzZUOH1FjNu.jpg",
          release_date: "2008-07-18",
          genre_ids: [18, 28, 80, 53],
          vote_average: 9.0,
          vote_count: 32000,
          adult: false,
          video: false,
          popularity: 123.456
        }
      ],
      total_pages: 500,
      total_results: 10000
    }
  },

  getTopRatedMovies: {
    url: '/movie/top_rated',
    method: 'GET' as const,
    mockData: {
      page: 1,
      results: [
        {
          id: 238,
          title: "The Godfather",
          original_title: "The Godfather",
          overview: "Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family.",
          poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
          backdrop_path: "/tmU7GeKVybMWFButWEGl2M4GeiP.jpg",
          release_date: "1972-03-14",
          genre_ids: [18, 80],
          vote_average: 8.7,
          vote_count: 19000,
          adult: false,
          video: false,
          popularity: 149.456
        }
      ],
      total_pages: 500,
      total_results: 10000
    }
  },

  getNowPlayingMovies: {
    url: '/movie/now_playing',
    method: 'GET' as const,
    mockData: {
      page: 1,
      results: [
        {
          id: 912649,
          title: "Venom: The Last Dance",
          original_title: "Venom: The Last Dance",
          overview: "Eddie and Venom are on the run. Hunted by both of their worlds and with the net closing in, the duo are forced into a devastating decision.",
          poster_path: "/aosm8NMQ3UyoBVpSxyimorCQykC.jpg",
          backdrop_path: "/3V4kLQg0kSqPLctI5ziYWabAZYF.jpg",
          release_date: "2024-10-22",
          genre_ids: [878, 28, 12],
          vote_average: 6.4,
          vote_count: 435,
          adult: false,
          video: false,
          popularity: 3648.927
        }
      ],
      total_pages: 15,
      total_results: 300
    }
  },

  getUpcomingMovies: {
    url: '/movie/upcoming',
    method: 'GET' as const,
    mockData: {
      page: 1,
      results: [
        {
          id: 1184918,
          title: "The Wild Robot",
          original_title: "The Wild Robot",
          overview: "After a shipwreck, an intelligent robot called Roz is stranded on an uninhabited island.",
          poster_path: "/wTnV3PCVW5O92JMrFvvrRcV39RU.jpg",
          backdrop_path: "/417tYZ4XUyJrtyZXj7HpvWf1E8f.jpg",
          release_date: "2024-09-12",
          genre_ids: [16, 878, 10751],
          vote_average: 8.5,
          vote_count: 3000,
          adult: false,
          video: false,
          popularity: 4555.123
        }
      ],
      total_pages: 50,
      total_results: 1000
    }
  },

  getMovieDetails: {
    url: '/movie/:id',
    method: 'GET' as const,
    mockData: {
      id: 550,
      title: "Fight Club",
      original_title: "Fight Club",
      overview: "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.",
      poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
      backdrop_path: "/hZkgoQYus5vegHoetLkCJzb17zJ.jpg",
      release_date: "1999-10-15",
      genres: [
        { id: 18, name: "Drama" },
        { id: 53, name: "Thriller" },
        { id: 35, name: "Comedy" }
      ],
      runtime: 139,
      vote_average: 8.433,
      vote_count: 26280,
      budget: 63000000,
      revenue: 100853753,
      status: "Released",
      tagline: "Mischief. Mayhem. Soap.",
      adult: false,
      video: false,
      popularity: 61.416,
      production_companies: [
        {
          id: 508,
          logo_path: "/7PzJdsLGlR7oW4J0J5Xcd0pHGRg.png",
          name: "Regency Enterprises",
          origin_country: "US"
        }
      ],
      production_countries: [
        {
          iso_3166_1: "US",
          name: "United States of America"
        }
      ],
      spoken_languages: [
        {
          english_name: "English",
          iso_639_1: "en",
          name: "English"
        }
      ]
    }
  },

  searchMovies: {
    url: '/search/movie',
    method: 'GET' as const,
    mockData: {
      page: 1,
      results: [
        {
          id: 550,
          title: "Fight Club",
          original_title: "Fight Club",
          overview: "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.",
          poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
          backdrop_path: "/hZkgoQYus5vegHoetLkCJzb17zJ.jpg",
          release_date: "1999-10-15",
          genre_ids: [18, 53, 35],
          vote_average: 8.433,
          vote_count: 26280,
          adult: false,
          video: false,
          popularity: 61.416
        }
      ],
      total_pages: 100,
      total_results: 2000
    }
  },

  getMovieCredits: {
    url: '/movie/:id/credits',
    method: 'GET' as const,
    mockData: {
      id: 550,
      cast: [
        {
          adult: false,
          gender: 2,
          id: 819,
          known_for_department: "Acting",
          name: "Edward Norton",
          original_name: "Edward Norton",
          popularity: 26.99,
          profile_path: "/8nytsqL59SFJTVHDbow564ky2WR.jpg",
          cast_id: 4,
          character: "The Narrator",
          credit_id: "52fe4250c3a36847f80149f3",
          order: 0
        },
        {
          adult: false,
          gender: 2,
          id: 287,
          known_for_department: "Acting",
          name: "Brad Pitt",
          original_name: "Brad Pitt",
          popularity: 49.297,
          profile_path: "/ajNaPmXVVMJFg9GWmu6MJzTaXdV.jpg",
          cast_id: 5,
          character: "Tyler Durden",
          credit_id: "52fe4250c3a36847f80149f7",
          order: 1
        }
      ],
      crew: [
        {
          adult: false,
          gender: 2,
          id: 7467,
          known_for_department: "Directing",
          name: "David Fincher",
          original_name: "David Fincher",
          popularity: 21.043,
          profile_path: "/tpEczFclQZeKAiCeKZZ0adRvtfz.jpg",
          credit_id: "52fe4250c3a36847f80149ff",
          department: "Directing",
          job: "Director"
        }
      ]
    }
  },

  getMovieVideos: {
    url: '/movie/:id/videos',
    method: 'GET' as const,
    mockData: {
      id: 550,
      results: [
        {
          iso_639_1: "en",
          iso_3166_1: "US",
          name: "Fight Club | #TBT Trailer | 20th Century FOX",
          key: "qtRKdVHc-cE",
          site: "YouTube",
          size: 1080,
          type: "Trailer",
          official: true,
          published_at: "2014-10-03T19:20:22.000Z",
          id: "5c9294240e0a267cd516835f"
        }
      ]
    }
  },

  // Genres endpoint
  getGenres: {
    url: '/genre/movie/list',
    method: 'GET' as const,
    mockData: {
      genres: [
        { id: 28, name: "Action" },
        { id: 12, name: "Adventure" },
        { id: 16, name: "Animation" },
        { id: 35, name: "Comedy" },
        { id: 80, name: "Crime" },
        { id: 99, name: "Documentary" },
        { id: 18, name: "Drama" },
        { id: 10751, name: "Family" },
        { id: 14, name: "Fantasy" },
        { id: 36, name: "History" },
        { id: 27, name: "Horror" },
        { id: 10402, name: "Music" },
        { id: 9648, name: "Mystery" },
        { id: 10749, name: "Romance" },
        { id: 878, name: "Science Fiction" },
        { id: 10770, name: "TV Movie" },
        { id: 53, name: "Thriller" },
        { id: 10752, name: "War" },
        { id: 37, name: "Western" }
      ]
    }
  },

  // Authentication endpoints (mock)
  login: {
    url: '/auth/login',
    method: 'POST' as const,
    mockData: {
      user: {
        id: 1,
        email: "user@example.com",
        name: "John Doe",
        avatar: "https://ui-avatars.com/api/?name=John+Doe"
      },
      token: "mock-jwt-token-12345",
      refreshToken: "mock-refresh-token-67890"
    }
  },

  register: {
    url: '/auth/register',
    method: 'POST' as const,
    mockData: {
      user: {
        id: 2,
        email: "newuser@example.com",
        name: "Jane Smith",
        avatar: "https://ui-avatars.com/api/?name=Jane+Smith"
      },
      token: "mock-jwt-token-54321",
      refreshToken: "mock-refresh-token-09876"
    }
  }
} as const;

export type ApiNodeKey = keyof typeof ApiNodes;
