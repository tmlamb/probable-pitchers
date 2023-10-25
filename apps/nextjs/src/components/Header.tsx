import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { classNames } from "../utils/tailwind";
import Button from "./Button";
import LinkButton from "./LinkButton";
import Modal from "./Modal";
import SignIn from "./SignIn";

const navigation = [
  {
    name: "Subscriptions",
    href: "/subscriptions",
  },
];
export default function Header() {
  const [showSignInModal, setShowSignInModal] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setShowSignInModal(router.query.showSignInModal === "true");
  }, [router.query]);

  const { data: session, status } = useSession();
  const loading = status === "loading";

  return (
    <Disclosure as="nav" className="bg-green">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                {session?.user && (
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-white hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                )}
              </div>
              <div className="flex flex-1 items-center justify-center sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <Link href="/" className="flex items-center">
                    <Image src="/logo.png" alt="" height={40} width={40} />
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  {session?.user && (
                    <div className="flex space-x-4">
                      {navigation.map((item) => (
                        <LinkButton key={item.name} href={item.href}>
                          {item.name}
                        </LinkButton>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {!session && !loading && (
                  <Button
                    onClick={() => {
                      setShowSignInModal(true);
                    }}
                  >
                    <span className="">Sign In</span>
                    <Modal open={showSignInModal} setOpen={setShowSignInModal}>
                      <SignIn />
                    </Modal>
                  </Button>
                )}
                {/* Profile dropdown */}
                {session?.user && (
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="flex rounded-full text-white text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue">
                        <span className="sr-only">Open user menu</span>
                        <UserCircleIcon
                          className="h-8 w-8"
                          aria-hidden="true"
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="/settings"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Settings
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="/support"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Support
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                signOut({ redirect: true, callbackUrl: "/" });
                              }}
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 w-full text-left text-sm text-gray-700"
                              )}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                )}
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className="bg-blue text-white block px-3 py-2 rounded-md active:opacity-25 text-base font-medium"
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
