import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Defs, Circle, G, Mask, Use, Path } from 'react-native-svg';

const Unicorn = ({ size }) => size === 'small' ?
  (
    <Svg width={35} height={35}>
      <Defs>
        <Circle id="prefix__b" cx={8.5} cy={8.5} r={8.5} />
      </Defs>
      <G
        filter="url(#prefix__a)"
        transform="translate(9 7)"
        fill="none"
        fillRule="evenodd"
      >
        <Mask id="prefix__e" fill="#fff">
          <Use xlinkHref="#prefix__b" />
        </Mask>
        <Use fill="#25CDD6" xlinkHref="#prefix__b" />
        <Use fill="#000" filter="url(#prefix__c)" xlinkHref="#prefix__b" />
        <Circle stroke="#A9F3F6" strokeWidth={2} cx={8.5} cy={8.5} r={9.5} />
        <G filter="url(#prefix__d)" mask="url(#prefix__e)">
          <Path fill="#6AD7FE" d="M6.445 2.038l.205-.927L5.638.017z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M5.638.016l.807 2.022.205-.927z"
          />
          <Path fill="#D3F8B5" d="M7.17 3.87l-.725-1.831.205-.929 1.116 1.213z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M7.17 3.87l-.725-1.831.205-.929 1.116 1.213z"
          />
          <Path
            fill="#EDE159"
            d="M7.869 5.629l-.698-1.76.595-1.545 1.122 1.24z"
          />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M7.869 5.629l-.698-1.76.595-1.545 1.122 1.24z"
          />
          <Path fill="#FFA660" d="M9.784 4.55l-.897-.986L7.87 5.629z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M9.784 4.55l-.897-.986L7.87 5.629z"
          />
          <Path fill="#E5A2FF" d="M9.784 4.549l.637-.394-.439-2.838z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M9.983 1.316l-.199 3.233.637-.394z"
          />
          <Path fill="#FF3490" d="M12.582 5.38L9.983 1.317l.437 2.839z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M12.582 5.38L9.983 1.317l.437 2.839z"
          />
          <Path fill="#FB63E3" d="M8.162 5.942L7.87 5.63l2.551-1.474z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M8.162 5.942L7.87 5.63l2.551-1.474z"
          />
          <Path fill="#FC49E2" d="M10.721 7.905L8.162 5.943l2.258-1.788z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M10.721 7.905L8.162 5.943l2.258-1.788z"
          />
          <Path
            fill="#E51EB9"
            d="M13.745 6.03l-3.024 1.875-.3-3.75 2.162 1.225z"
          />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M13.745 6.03l-3.024 1.875-.3-3.75 2.162 1.225z"
          />
          <Path
            fill="#D801A0"
            d="M14.238 6.3l-2.664-2.494 1.008 1.574 1.138.637z"
          />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M14.238 6.3l-2.664-2.494 1.008 1.574 1.138.637z"
          />
          <Path fill="#FFAB5F" d="M14.239 6.3l.56.322 1.663-.978z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M16.462 5.644L14.8 6.62l-.562-.322z"
          />
          <Path fill="#FFD577" d="M11.575 3.806l4.887 1.838-2.223.655z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M11.575 3.806l4.887 1.838-2.223.655z"
          />
          <Path fill="#FE6A78" d="M16.379 10.307l2.17-.715-3.75-2.97z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M16.38 10.307L14.8 6.62l3.748 2.97z"
          />
          <Path fill="#FE5F5A" d="M16.379 10.307l.418.62 1.752-1.335z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M16.797 10.927l-.418-.62 2.17-.715z"
          />
          <Path
            fill="#C101A0"
            d="M15.052 8.825L13.745 6.03l1.054.592 1.58 3.686z"
          />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M15.052 8.825L13.745 6.03l1.054.592 1.58 3.686z"
          />
          <Path fill="#E61FBA" d="M13.006 10.307l.739-4.278 1.307 2.796z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M13.006 10.307l.739-4.278 1.307 2.796z"
          />
          <Path fill="#EE1EBA" d="M10.721 7.905l2.285 2.401.74-4.276z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M10.721 7.905l2.285 2.401.74-4.276z"
          />
          <Path fill="#984AEE" d="M7.869 7.08l1.61-.127-1.317-.544z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M7.869 7.081l.293-.672 1.317.544z"
          />
          <Path fill="#D61EBB" d="M8.162 5.942l-.293 1.14.293-.672 1.317.542z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M8.162 5.942l-.293 1.14.293-.672 1.317.542z"
          />
          <Path fill="#F8A3F6" d="M5.278 9.242l2.59-2.161.294-1.138-.294-.314z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M5.278 9.242l2.59-2.161.294-1.138-.294-.314z"
          />
          <Path
            fill="#FF9AFA"
            d="M5.278 9.242l-1.87 1.575 1.355.855L7.869 7.08z"
          />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M4.762 11.672l-1.354-.854 1.87-1.576 2.59-2.161z"
          />
          <Path
            fill="#FF88FE"
            d="M10.721 7.905l-5.958 3.766 3.106-4.59 1.61-.129z"
          />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M10.721 7.905l-5.958 3.766 3.106-4.59 1.61-.129z"
          />
          <Path fill="#E4A3FF" d="M3.408 12.705l1.355-1.033-1.355-.854z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M3.408 12.705v-1.887l1.355.853z"
          />
          <Path fill="#C492FE" d="M3.408 12.705l2.033.74-.678-1.773z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M5.442 13.444l-.68-1.772-1.354 1.033z"
          />
          <Path fill="#F54ACC" d="M8.544 11.44l-3.102 2.004-.68-1.772z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M8.544 11.44l-3.102 2.004-.68-1.772z"
          />
          <Path
            fill="#BF00A2"
            d="M11.299 11.12L8.67 12.229l-3.229 1.215 3.103-2.004z"
          />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M11.299 11.12L8.67 12.229l-3.229 1.215 3.103-2.004z"
          />
          <Path fill="#A700A0" d="M10.532 12.083l.767-.964-2.756 1.164z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M10.532 12.083l.767-.964-2.756 1.164z"
          />
          <Path fill="#FF4CD3" d="M10.721 7.905L8.544 11.44l2.755-.32z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M10.721 7.905L8.544 11.44l2.755-.32z"
          />
          <Path fill="#FF5DFF" d="M13.006 10.307l-1.707.813-.578-3.214z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M13.006 10.307l-1.707.813-.578-3.214z"
          />
          <Path fill="#A644F0" d="M9.437 18.008l.986-.34.073-3.104z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M9.438 18.009l1.058-3.445-.073 3.104z"
          />
          <Path
            fill="#9B3BED"
            d="M10.532 12.083l-.036 2.482-.074 3.104.877-6.55z"
          />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M10.532 12.083l.767-.964-.876 6.548.073-3.103z"
          />
          <Path fill="#FE68FF" d="M11.299 11.12l-.876 6.548 2.583-7.361z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M13.006 10.307l-1.707.813-.877 6.548z"
          />
          <Path fill="#FF53FF" d="M10.422 17.668l3.978-.44-1.394-6.921z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M14.4 17.23l-3.977.438 2.583-7.362z"
          />
          <Path fill="#C700A1" d="M14.4 17.23l1.979-1.684-3.374-5.24z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M16.38 15.546L14.4 17.23l-1.394-6.922z"
          />
          <Path fill="#D71EBA" d="M15.052 8.825l1.327 6.72-3.373-5.238z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M15.052 8.825l1.327 6.72-3.373-5.238z"
          />
          <Path fill="#B301A1" d="M16.38 10.307v5.239l-1.327-6.72z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M16.38 10.307v5.239l-1.327-6.72z"
          />
          <Path fill="#FF2C9F" d="M18.049 15.78l-1.67-5.473v5.239z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M18.049 15.78l-1.67-5.473v5.239z"
          />
          <Path
            fill="#FF2C81"
            d="M18.395 13.416l-.346 2.363-1.67-5.473.418.62z"
          />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M18.395 13.416l-.346 2.363-1.67-5.473.418.62z"
          />
          <Path fill="#FF52D7" d="M8.544 11.44l2.177-3.534-5.958 3.766z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M8.544 11.44l2.177-3.534-5.958 3.766z"
          />
        </G>
      </G>
    </Svg>
  ) : (
    <Svg width={58} height={58}>
      <Defs>
        <Circle id="prefix__a" cx={25} cy={25} r={25} />
      </Defs>
      <G transform="translate(4 4)" fill="none" fillRule="evenodd">
        <Mask id="prefix__c" fill="#fff">
          <Use xlinkHref="#prefix__a" />
        </Mask>
        <Use fill="#25CDD6" xlinkHref="#prefix__a" />
        <Use fill="#000" filter="url(#prefix__b)" xlinkHref="#prefix__a" />
        <Circle stroke="#FFF" strokeWidth={4} cx={25} cy={25} r={27} />
        <G mask="url(#prefix__c)">
          <Path fill="#6AD7FE" d="M18.956 5.995l.603-2.727L16.58.051z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M16.582.048l2.375 5.947.602-2.726z"
          />
          <Path
            fill="#D3F8B5"
            d="M21.09 11.382l-2.134-5.386.602-2.73 3.284 3.566z"
          />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M21.09 11.382l-2.134-5.386.602-2.73 3.284 3.566z"
          />
          <Path
            fill="#EDE159"
            d="M23.143 16.556L21.09 11.38l1.749-4.547 3.301 3.648z"
          />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M23.143 16.556L21.09 11.38l1.749-4.547 3.301 3.648z"
          />
          <Path fill="#FFA660" d="M28.776 13.38l-2.637-2.898-2.995 6.074z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M28.776 13.38l-2.637-2.898-2.995 6.074z"
          />
          <Path fill="#E5A2FF" d="M28.775 13.38l1.874-1.16-1.289-8.347z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M29.361 3.87l-.585 9.51 1.874-1.159z"
          />
          <Path fill="#FF3490" d="M37.006 15.826L29.362 3.872l1.285 8.347z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M37.006 15.826L29.362 3.872l1.285 8.347z"
          />
          <Path fill="#FB63E3" d="M24.007 17.477l-.864-.921 7.505-4.335z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M24.007 17.477l-.864-.921 7.505-4.335z"
          />
          <Path fill="#FC49E2" d="M31.533 23.25l-7.526-5.772 6.641-5.257z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M31.533 23.25l-7.526-5.772 6.641-5.257z"
          />
          <Path
            fill="#E51EB9"
            d="M40.428 17.737l-8.895 5.513-.884-11.03 6.359 3.604z"
          />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M40.428 17.737l-8.895 5.513-.884-11.03 6.359 3.604z"
          />
          <Path
            fill="#D801A0"
            d="M41.877 18.529l-7.835-7.334 2.963 4.63 3.349 1.871z"
          />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M41.877 18.529l-7.835-7.334 2.963 4.63 3.349 1.871z"
          />
          <Path fill="#FFAB5F" d="M41.878 18.53l1.648.946 4.892-2.875z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M48.418 16.599l-4.89 2.875-1.65-.946z"
          />
          <Path fill="#FFD577" d="M34.044 11.194l14.374 5.405-6.54 1.929z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M34.044 11.194l14.374 5.405-6.54 1.929z"
          />
          <Path fill="#FE6A78" d="M48.173 30.314l6.383-2.103-11.029-8.737z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M48.174 30.314l-4.646-10.84 11.026 8.738z"
          />
          <Path fill="#FE5F5A" d="M48.173 30.314l1.23 1.824 5.153-3.927z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M49.403 32.139l-1.229-1.825 6.38-2.102z"
          />
          <Path
            fill="#C101A0"
            d="M44.272 25.957l-3.845-8.224 3.1 1.742 4.646 10.84z"
          />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M44.272 25.957l-3.845-8.224 3.1 1.742 4.646 10.84z"
          />
          <Path fill="#E61FBA" d="M38.253 30.314l2.173-12.581 3.845 8.224z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M38.253 30.314l2.173-12.581 3.845 8.224z"
          />
          <Path fill="#EE1EBA" d="M31.533 23.25l6.721 7.063 2.173-12.578z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M31.533 23.25l6.721 7.063 2.173-12.578z"
          />
          <Path fill="#984AEE" d="M23.143 20.826l4.738-.377-3.874-1.599z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M23.143 20.827l.864-1.976 3.874 1.599z"
          />
          <Path
            fill="#D61EBB"
            d="M24.007 17.477l-.864 3.35.864-1.975 3.874 1.596z"
          />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M24.007 17.477l-.864 3.35.864-1.975 3.874 1.596z"
          />
          <Path
            fill="#F8A3F6"
            d="M15.524 27.181l7.617-6.355.864-3.347-.864-.922z"
          />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M15.524 27.181l7.617-6.355.864-3.347-.864-.922z"
          />
          <Path
            fill="#FF9AFA"
            d="M15.523 27.182l-5.498 4.633 3.984 2.514 9.135-13.503z"
          />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M14.007 34.328l-3.984-2.51 5.501-4.637 7.618-6.355z"
          />
          <Path
            fill="#FF88FE"
            d="M31.533 23.25L14.008 34.329l9.135-13.503 4.738-.377z"
          />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M31.533 23.25L14.008 34.329l9.135-13.503 4.738-.377z"
          />
          <Path fill="#E4A3FF" d="M10.024 37.368l3.984-3.037-3.984-2.515z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M10.024 37.368v-5.551l3.984 2.51z"
          />
          <Path fill="#C492FE" d="M10.024 37.368l5.98 2.175-1.996-5.212z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M16.005 39.542l-1.998-5.212-3.984 3.036z"
          />
          <Path fill="#F54ACC" d="M25.128 33.648l-9.123 5.893-1.997-5.212z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M25.128 33.648l-9.123 5.893-1.997-5.212z"
          />
          <Path
            fill="#BF00A2"
            d="M33.232 32.705L25.5 35.966l-9.497 3.576 9.126-5.894z"
          />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M33.232 32.705L25.5 35.966l-9.497 3.576 9.126-5.894z"
          />
          <Path fill="#A700A0" d="M30.976 35.537l2.257-2.834-8.105 3.423z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M30.976 35.537l2.257-2.834-8.105 3.423z"
          />
          <Path fill="#FF4CD3" d="M31.533 23.25l-6.404 10.397 8.102-.944z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M31.533 23.25l-6.404 10.397 8.102-.944z"
          />
          <Path fill="#FF5DFF" d="M38.253 30.314l-5.02 2.391-1.701-9.452z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M38.253 30.314l-5.02 2.391-1.701-9.452z"
          />
          <Path fill="#A644F0" d="M27.757 52.966l2.898-1.001.216-9.13z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M27.758 52.966l3.111-10.13-.213 9.13z"
          />
          <Path
            fill="#9B3BED"
            d="M30.977 35.538l-.107 7.3-.217 9.129 2.58-19.263z"
          />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M30.976 35.537l2.257-2.834-2.577 19.26.213-9.127z"
          />
          <Path fill="#FE68FF" d="M33.232 32.705l-2.577 19.26 7.597-21.65z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M38.253 30.314l-5.02 2.391-2.58 19.26z"
          />
          <Path fill="#FF53FF" d="M30.654 51.965l11.7-1.292-4.1-20.358z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M42.353 50.675l-11.697 1.289 7.597-21.65z"
          />
          <Path fill="#C700A1" d="M42.354 50.674l5.818-4.95-9.921-15.411z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M48.174 45.724l-5.822 4.95-4.1-20.36z"
          />
          <Path fill="#D71EBA" d="M44.272 25.957l3.9 19.766-9.918-15.409z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M44.272 25.957l3.9 19.766-9.918-15.409z"
          />
          <Path fill="#B301A1" d="M48.174 30.314v15.41l-3.901-19.767z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M48.174 30.314v15.41l-3.901-19.767z"
          />
          <Path fill="#FF2C9F" d="M53.085 46.41l-4.91-16.096v15.41z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M53.085 46.41l-4.91-16.096v15.41z"
          />
          <Path
            fill="#FF2C81"
            d="M54.103 39.459l-1.018 6.95-4.91-16.096 1.228 1.824z"
          />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M54.103 39.459l-1.018 6.95-4.91-16.096 1.228 1.824z"
          />
          <Path fill="#FF52D7" d="M25.128 33.648l6.404-10.396-17.524 11.077z" />
          <Path
            stroke="#FFF"
            strokeWidth={0.007}
            d="M25.128 33.648l6.404-10.396-17.524 11.077z"
          />
        </G>
      </G>
    </Svg>
  );

Unicorn.propTypes = {
  size: PropTypes.string,
};

Unicorn.defaultProps = {
  size: 'large'
};

export default Unicorn;
