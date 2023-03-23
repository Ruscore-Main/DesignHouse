import React from "react"
import ContentLoader from "react-content-loader"

const LoaderFavoriteBlock = (props) => (
  <ContentLoader 
    speed={1}
    width={200}
    height={200}
    viewBox="0 0 200 200"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
    className="favorite-block"
  >
    <rect x="10" y="10" rx="15" ry="15" width="180" height="98" /> 
    <rect x="25" y="112" rx="0" ry="0" width="150" height="38" /> 
    <rect x="8" y="155" rx="0" ry="0" width="50" height="20" /> 
    <rect x="8" y="180" rx="0" ry="0" width="90" height="19" />
  </ContentLoader>
)

export default LoaderFavoriteBlock;