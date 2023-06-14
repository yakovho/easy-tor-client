import React from 'react';
import 'react-calendar/dist/Calendar.css';
import '../App.css';
import { Watch } from 'react-loader-spinner'


function Loading() {

    return (
        <div className='schedulr_spinner'>
            <Watch height="100" width="100" radius="48" color="#10b981"
                ariaLabel="watch-loading" wrapperStyle={{display: 'center'}} wrapperClassName="" visible={true} />
        </div>
    );
}

export default Loading;