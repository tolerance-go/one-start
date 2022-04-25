import type { Location } from 'umi';
import Admin from './admin';

export default (props: { location: Location }) => {
  //   return (
  //     <div>
  //       <div>pathname: {props.location.pathname}</div>
  //     </div>
  //   );
  return <Admin {...props} />;
};
