const search = document.querySelector('.repository__search')
const dropDown = document.querySelector('.repository__dropdown')
const repositoryList = document.querySelector('.repository__list')

const debounce = (fn, throttleTime) => {
  let stopTime = null
  return function (...args) {
    clearTimeout(stopTime)
    stopTime = setTimeout(() => {
      fn.apply(this, args)
    }, throttleTime)
  }
}
const createRepositoryItem = async function (e) {
  try {
    if (e.target.dataset.jsAddreposytory === '') {
      const response = await fetch(
        `https://api.github.com/search/repositories?q=${search.value}&sort=stars&order=desc&per_page=5`
      )
      const result = await response.json()
      const repositories = result.items
      const repositoriesFilter = repositories.filter(
        (elem) => elem.name === e.target.textContent
      )
      const repositoryItem = `<li class="repository__item">
        <div class="repository__info">
          <p>Name: ${repositoriesFilter[0].name}</p>
          <p>Owner: ${repositoriesFilter[0].owner.login}</p>
          <p>Stars: ${repositoriesFilter[0].stargazers_count}</p>
        </div>
        <button class="repository__delete" type="button" data-js-delete></button>
      </li>`
      repositoryList.insertAdjacentHTML('afterbegin', repositoryItem)
      search.value = ''
      dropDown.innerHTML = ''
    }
    if (e.target.dataset.jsDelete === '') {
      e.target.closest('.repository__item').remove()
    }
  } catch (e) {
    console.log(e)
  }
}
const getRepository = async (e) => {
  try {
    if (search.value === '') {
      dropDown.innerHTML = ''
      return
    }
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${search.value}&sort=stars&order=desc&per_page=5`
    )
    const result = await response.json()

    let dropDownHTML = ''
    const repositories = result.items
    for (const repository of repositories) {
      dropDownHTML += `<li class="repository__dropdown-item" data-js-addreposytory>${repository.name}</li>`
    }
    dropDown.innerHTML = dropDownHTML
  } catch (e) {
    console.log(e)
  }
}

document.addEventListener('click', createRepositoryItem)

search.addEventListener('input', debounce(getRepository, 500))
