import React from 'react';

class CategoriesHeader extends React.Component {
    state = { menuOpen: false }

    componentDidMount() {
        document.addEventListener('click', this.handleClick, false);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClick, false);
    }
    handleClick = (e) => {
        if (!this.node.contains(e.target) && this.state.menuOpen) {
            this.setState({ menuOpen: false });
        }
    }
    toggleMenu = () => {
        let { menuOpen } = this.state;
        if (!menuOpen) {
            this.scrollToTop();
        }
        this.setState({ menuOpen: !menuOpen });
    }
    scrollToTop = () => {
        this.top.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
    }
    render() {
        const { categoryName } = this.props;
        return (
            <div ref={top => { this.top = top; }} >
                <div className='Categories-header' onClick={this.toggleMenu} ref={node => { this.node = node; }}>
                    <span className='Categories-select'>
                        {categoryName}
                        <svg height="24" width="24" viewBox="0 0 24 24" fill="#000">
                            <path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z" />
                        </svg>
                    </span>
                    {this.state.menuOpen &&
                        <div className='Categories-menu'>
                        <div onClick={() => { this.props.handleSelect("Featured", 'featured-playlists') }} className='Categories-category'>Featured</div>
                        <div onClick={() => { this.props.handleSelect("Top", 'categories/toplists/playlists') }} className='Categories-category'>Top</div>
                        <div onClick={() => { this.props.handleSelect("Focus", 'categories/focus/playlists') }} className='Categories-category'>Focus</div>
                        <div onClick={() => { this.props.handleSelect("Chill", 'categories/chill/playlists') }} className='Categories-category'>Chill</div>
                    </div>
                    }
                </div>
            </div>
        );
    }
}

CategoriesHeader.displayName = "CategoriesHeader";

export default CategoriesHeader;