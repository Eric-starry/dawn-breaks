/**
 * 角色权限控制组件 License By http://eleadmin.com
 */
import store from '@/store';

export default {
    install (app) {
        // 添加全局方法
        app.config.globalProperties.$hasRole = this.hasRole;
        app.config.globalProperties.$hasAnyRole = this.hasAnyRole;
        app.config.globalProperties.$hasPermission = this.hasPermission;
        app.config.globalProperties.$hasAnyPermission = this.hasAnyPermission;

        // 添加自定义指令
        app.directive('role', {
            bind: (el, binding) => {
                if (!this.hasRole(binding)) {
                    el.parentNode.removeChild(el);
                }
            }
        });
        app.directive('any-role', {
            bind: (el, binding) => {
                if (!this.hasAnyRole(binding)) {
                    el.parentNode.removeChild(el);
                }
            }
        });
        app.directive('permission', {
            bind: (el, binding) => {
                if (!this.hasPermission(binding)) {
                    el.parentNode.removeChild(el);
                }
            }
        });
        app.directive('any-permission', {
            bind: (el, binding) => {
                if (!this.hasAnyPermission(binding)) {
                    el.parentNode.removeChild(el);
                }
            }
        });
    },
    /**
     * 是否有某些角色
     * @param role 字符或字符数组
     * @returns {boolean}
     */
    hasRole (role) {
        if (!role) return true;
        let roles = store.state.user.roles;
        if (!roles) return false;
        if (Array.isArray(role)) {
            for (let i = 0; i < role.length; i++) {
                if (roles.indexOf(role[i]) === -1) {
                    return false;
                }
            }
            return true;
        }
        return roles.indexOf(role) !== -1;
    },
    /**
     * 是否有任意角色
     * @param role 字符或字符数组
     * @returns {boolean}
     */
    hasAnyRole (role) {
        if (!role) return true;
        let roles = store.state.user.roles;
        if (!roles) return false;
        if (Array.isArray(role)) {
            for (let i = 0; i < role.length; i++) {
                if (roles.indexOf(role[i]) !== -1) {
                    return true;
                }
            }
            return false;
        }
        return roles.indexOf(role) !== -1;
    },
    /**
     * 是否有某些权限
     * @param auth 字符或字符数组
     * @returns {boolean}
     */
    hasPermission (auth) {
        if (!auth) return true;
        let authorities = store.state.user.authorities;
        if (!authorities) return false;
        if (Array.isArray(auth)) {
            for (let i = 0; i < auth.length; i++) {
                if (authorities.indexOf(auth[i]) === -1) {
                    return false;
                }
            }
            return true;
        }
        return authorities.indexOf(auth) !== -1;
    },
    /**
     * 是否有任意权限
     * @param auth 字符或字符数组
     * @returns {boolean}
     */
    hasAnyPermission (auth) {
        if (!auth) return true;
        let authorities = store.state.user.authorities;
        if (!authorities) return false;
        if (Array.isArray(auth)) {
            for (let i = 0; i < auth.length; i++) {
                if (authorities.indexOf(auth[i]) !== -1) {
                    return true;
                }
            }
            return false;
        }
        return authorities.indexOf(auth) !== -1;
    }
};
