import { Blocks } from 'react-loader-spinner'
export function Loader() {

  return (
   <div className="flex justify-center items-center min-h-screen">
    <Blocks
      height="80"
      width="80"
      color="red"
      ariaLabel="blocks-loading"
      wrapperStyle={{}}
      wrapperClass="blocks-wrapper"
      visible={true}
    />
   </div>
  )
}