import React, {useState, useEffect, useRef} from 'react'
import {connect} from 'react-redux'
import styled from 'styled-components'
import {Creatable} from "react-select"
import {translate} from "react-i18next"
import isEqual from "lodash/isEqual"


const SearchInput = (props) => {

  const {t} = props

  const [allOptions, setAllOptions] = useState([])
  const [options, setOptions] = useState([])
  const prevAllTags = useRef([])

  useEffect(() => {
    if (!isEqual(prevAllTags.current, props.allTags)) {
      prevAllTags.current = props.allTags

      const options = props.allTags.map(tag => ({label: `#${tag}`, value: `#${tag}`}))

      setAllOptions(options)
      setOptions(options.slice(0, 5))
    }
  }, [props.allTags])


  const filterOptions = (input) => {
    const searchString = input.toLowerCase().trim();
    const res = allOptions.filter(function(d) {
      return d.label.match( searchString );
    });

    const newOptions = res.slice(0, 5)

    setOptions(newOptions)
  }

  const onInputChange = (input, actionMeta) => {
    const {action} = actionMeta
    if (action === "input-blur" || action === "menu-close") {
      return
    }

    const tokens = input.split(' ')
    const lastToken = tokens[tokens.length-1].trim()
    onChange(input)
    filterOptions(lastToken)
  }

  const handleChange = (newValue, actionMeta) => {
    // TODO: dispatch on change
    if (!!newValue && newValue.length) {
      let newInputValue = props.searchText
      if (newInputValue.length && newInputValue.slice(-1) === ' ') {
        newInputValue = `${newInputValue} ${newValue[0].label}`
      } else {
        const tokens = props.searchText.trim().split(" ").filter(t => t.length)
        tokens.pop()
        tokens.push(newValue[0].label)
        newInputValue = tokens.join(' ')
      }

      onChange(newInputValue)
    }
  };

  const onChange = (newInputValue) => {
    props.onChange(newInputValue)
  }

  return (
    <Recommender
      delimeter=" "
      formatCreateLabel={(inputValue) => (inputValue)}
      filterOption={(option) => true}
      isMulti
      styles={{
        control: (provided, state) => ({
          ...provided,
          border: 'none',
          boxShadow: 'none'
        }),
        menu: (provided, state) => ({
          ...provided,
          width: '85%'
        })
      }}
      onBlur={() => {}}
      onInputChange={onInputChange}
      onChange={handleChange}
      onKeyDown={props.onKeyDown}
      options={options}
      placeholder={t("searchbar.placeholder")}
      inputValue={props.searchText}
      value={[]}
    />
  )
}

const mapStateToProps = ({search}) => {
  return {
    allTags: search.tags.map(tagPair => tagPair[0])
  }
}

export default translate('translation')(connect(mapStateToProps)(SearchInput))

const Recommender = styled(Creatable)`
  font-size: 1em !important;
  line-height: 1em !important;
  font-weight: 100;
  padding-left: 2.7em !important;
  padding-right: 0.5em !important;
  z-index: 999 !important;
  margin-top: 2px;
`