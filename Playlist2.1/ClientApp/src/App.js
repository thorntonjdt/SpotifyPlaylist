import React from 'react';
import { Route } from 'react-router';
import Home from './components/Home';
import Playlist from './components/Playlist';
import Player from './components/Player';
import Modal from './components/Modal';

export default () => (
    <div>
        <Player />
        <Route exact path='/' component={Home} />
        <Route path='/playlist' component={Playlist} />
        <Modal />
    </div>
);
