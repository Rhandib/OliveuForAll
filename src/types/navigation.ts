export type Route = 
  | '/'
  | '/child'
  | '/parent'
  | '/child/art'
  | '/child/music'
  | '/child/games'
  | '/child/video'
  | '/child/treasure'
  | '/child/timer'
  | '/emotions'
  | '/parent/resources'
  | '/parent/medical'
  | '/parent/contacts'
  | '/parent/ai-agent'
  | '/parent/medication-agent'
  | '/notes'
  | '/parent/affirmations';

export type NavigateFunction = (route: Route) => void;