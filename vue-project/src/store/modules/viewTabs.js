const state = {
  viewTabs: [],
};

const mutations = {
  ADD_VIEW_ITEM: (state, view) => {
    state.viewTabs.forEach(item => item.active = "");
    let _index = state.viewTabs.findIndex(item => item.path == view.path)
    if(_index > -1) {
      state.viewTabs.splice(_index, 1, view)
    } else {
      state.viewTabs.push(view);
    }
  },

  DEL_VISITED_VIEW: (state, viewTabs) => {
    state.viewTabs.splice(0,state.viewTabs.length, ...viewTabs)
  },

  DEL_OTHERS_VISITED_VIEWS: (state, view) => {
    state.visitedViews = state.visitedViews.filter(v => {
      return v.meta.affix || v.path === view.path;
    });
  },

  DEL_ALL_VISITED_VIEWS: state => {
    // keep affix tags
    const affixTags = state.visitedViews.filter(tag => tag.meta.affix);
    state.visitedViews = affixTags;
  },

  UPDATE_VISITED_VIEW: (state, view) => {
    for (let v of state.visitedViews) {
      if (v.path === view.path) {
        v = Object.assign(v, view);
        break;
      }
    }
  }
};

const actions = {
  addViewItem({ commit }, view) {
    commit("ADD_VIEW_ITEM", view);
  },

  delVisitedView({ commit }, viewTabs) {
    console.log(viewTabs)
    commit("DEL_VISITED_VIEW", viewTabs);
  },

  delOthersViews({ dispatch, state }, view) {
    return new Promise(resolve => {
      dispatch("delOthersVisitedViews", view);
      dispatch("delOthersCachedViews", view);
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      });
    });
  },
  delOthersVisitedViews({ commit, state }, view) {
    return new Promise(resolve => {
      commit("DEL_OTHERS_VISITED_VIEWS", view);
      resolve([...state.visitedViews]);
    });
  },

  delAllViews({ dispatch, state }, view) {
    return new Promise(resolve => {
      dispatch("delAllVisitedViews", view);
      dispatch("delAllCachedViews", view);
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      });
    });
  },
  delAllVisitedViews({ commit, state }) {
    return new Promise(resolve => {
      commit("DEL_ALL_VISITED_VIEWS");
      resolve([...state.visitedViews]);
    });
  },

  updateVisitedView({ commit }, view) {
    commit("UPDATE_VISITED_VIEW", view);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
