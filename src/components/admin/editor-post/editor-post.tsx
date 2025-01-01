import React, { FC } from 'react'

interface ICratePost {
  buttonTitle: string
}

const EditorPost: FC<ICratePost> = ({ buttonTitle }) => {
  return <div>{buttonTitle}</div>
}

export default EditorPost
