import moment from 'moment';
import utl from 'lodash';
// @ts-ignore
import pkg2 from '@ty-swap-pages/example-check-used-depends-must-in-pkg-pkg2';

console.log(pkg2);

console.log(moment());

export default () => {
  return <>{utl.random()}</>;
};
