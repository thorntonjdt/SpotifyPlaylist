import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from '../store/Playlists';

import CategoriesHeader from './CategoriesHeader';

class FeaturedList extends React.PureComponent {
    componentWillMount() {
        this.props.requestFeaturedPlaylists();
    }
    render() {
        const { isLoading, playlists, categories, categoryName, requestPlaylistsByCategory, viewTracks } = this.props;
        if (isLoading) {
            return (
                <div>Loading...</div>
            )
        }

        return (
            <div className='FeaturedList-container' >
                <CategoriesHeader categories={categories} categoryName={categoryName} handleSelect={requestPlaylistsByCategory} />
                {playlists.map(playlist =>
                    <span
                        key={playlist.id}
                        className='FeaturedList-tile'
                        style={{ backgroundImage: `url(${playlist.images[0].url})` }}
                        onClick={() => { viewTracks(playlist) }}
                    >
                    </span>
                )}
            </div>
        )
    }

}

export default connect(
    state => state.playlists,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(FeaturedList);
