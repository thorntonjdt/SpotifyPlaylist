﻿import React from 'react';

export class CategoriesHeader extends React.Component {
    constructor() {
        super();
        this.state = {
            menuOpen: false
        }
        this.handleClick = this.handleClick.bind(this);
        this.toggleMenu = this.toggleMenu.bind(this);
        this.scrollToTop = this.scrollToTop.bind(this);
    }
    componentDidMount() {
        document.addEventListener('click', this.handleClick, false);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClick, false);
    }
    handleClick(e) {
        if (!this.node.contains(e.target) && this.state.menuOpen) {
            this.setState({menuOpen: false})
        }
    }
    toggleMenu() {
        let { menuOpen } = this.state;
        if (!menuOpen) {
            this.scrollToTop()
        }
        this.setState({ menuOpen: !menuOpen });
    }
    scrollToTop(){
        this.top.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
    }
    render() {
        const { categoryName, categories } = this.props;
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
                            {categories.letters.map(letter =>
                                <span key={letter} className='Categories-section'>
                                    <span className='Categories-title'>{letter}</span>
                                    {categories[letter].map(category =>
                                        <div key={category.id} onClick={() => {this.props.handleSelect(category.name, category.id)}} className='Categories-category'>{category.name}</div>
                                    )}
                                </span>
                            )}
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default CategoriesHeader;