/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react';
import SpanTagInstruction from './../spantag-instruction'
export default function (props) {
    return(
        <div>
        <SpanTagInstruction
        progress={props.progress}
        onProgressChange={props.onProgressChange}
        spanTagAlreadyExist={props.spanTagAlreadyExist}
        loading={props.loading}
        spanTags={props.spanTags}
        />
        </div>
    )
}
